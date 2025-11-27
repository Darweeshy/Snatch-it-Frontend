import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import { formatCurrency } from '../../utils/formatCurrency';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10); // Customize page size
    const navigate = useNavigate();

    const fetchProducts = async (pageNumber = 0) => {
        setIsLoading(true);
        try {
            const response = await API.get('/api/products', {
                params: { page: pageNumber, size: pageSize }
            });

            // Handle paginated API response
            if (response.data && response.data.content && Array.isArray(response.data.content)) {
                setProducts(response.data.content);
                setPage(response.data.page || pageNumber);
                setTotalPages(response.data.totalPages || 1);
            } 
            // Handle plain array response
            else if (Array.isArray(response.data)) {
                setProducts(response.data);
                setPage(0);
                setTotalPages(1);
            } 
            else {
                setProducts([]);
                toast.error('Received an unexpected data format for products.');
            }
        } catch (error) {
            toast.error('Failed to fetch products.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const openDeleteModal = (product) => {
        setProductToDelete(product);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setProductToDelete(null);
        setIsModalOpen(false);
    };

    const handleDelete = async () => {
        if (!productToDelete) return;
        try {
            await API.delete(`/api/admin/products/${productToDelete.id}`);
            toast.success(`Product "${productToDelete.name}" archived successfully.`);
            fetchProducts(page); // Refresh the current page
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error(error.response.data.message || 'Cannot delete: Product is in use.');
            } else {
                toast.error('Failed to archive product.');
            }
            console.error(error);
        } finally {
            closeDeleteModal();
        }
    };

    const goToPage = (pageNumber) => {
        if (pageNumber < 0 || pageNumber >= totalPages) return;
        fetchProducts(pageNumber);
    };

    return (
        <div>
            <PageHeader title="Manage Products">
                <Button onClick={() => navigate('/admin/products/add')}>
                    <i className="bi bi-plus-lg mr-2"></i>
                    Add New Product
                </Button>
            </PageHeader>

            {isLoading ? (
                <div className="flex justify-center"><Spinner size="lg" /></div>
            ) : (
                <div>
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="min-w-full divide-y divide-secondary-200">
                            <thead className="bg-secondary-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Brand</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Base Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-200">
                                {products.map(prod => (
                                    <tr key={prod.id} className="hover:bg-secondary-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">{prod.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{prod.categoryName || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{prod.brand}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                                            {formatCurrency(prod.basePrice)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{prod.stockQuantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                                            <Button variant="outline" onClick={() => navigate(`/admin/products/update/${prod.id}`)}>Edit</Button>
                                            <Button variant="danger" onClick={() => openDeleteModal(prod)}>Archive</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-center gap-4 mt-4">
                        <Button variant="outline" onClick={() => goToPage(page - 1)} disabled={page === 0}>
                            Previous
                        </Button>
                        <span className="px-4 py-2 text-sm text-secondary-700">Page {page + 1} of {totalPages}</span>
                        <Button variant="outline" onClick={() => goToPage(page + 1)} disabled={page + 1 >= totalPages}>
                            Next
                        </Button>
                    </div>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={closeDeleteModal} title="Archive Product">
                <p>Are you sure you want to archive the product "<strong>{productToDelete?.name}</strong>"?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={closeDeleteModal}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Archive</Button>
                </div>
            </Modal>
        </div>
    );
};

export default ManageProducts;
