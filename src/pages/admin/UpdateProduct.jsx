// ========== FILE: src/pages/admin/UpdateProduct.jsx ==========
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '@/api/client';
import toast from 'react-hot-toast';

import PageHeader from '@/components/shared/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import MediaManager from './media/MediaManager';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);

    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [activeVariantIndex, setActiveVariantIndex] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsPageLoading(true);
            try {
                const [productRes, categoriesRes] = await Promise.all([
                    API.get(`/api/admin/products/${id}`),
                    API.get('/api/admin/categories/flat')
                ]);

                const productData = productRes.data;
                setProduct({
                    name: productData.name,
                    description: productData.description,
                    brand: productData.brand,
                    categoryId: productData.category?.id || ''
                });
                setVariants(productData.variants.map(v => ({
                    ...v,
                    image: null, // for new file uploads
                    clientImageUrl: v.imageUrl ? `${VITE_API_BASE_URL}${v.imageUrl}` : null
                })));
                setCategories(categoriesRes.data);
            } catch (error) {
                toast.error("Failed to fetch product data.");
                navigate('/admin/products');
            } finally {
                setIsPageLoading(false);
            }
        };
        fetchInitialData();
    }, [id, navigate]);

    const handleProductChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleVariantChange = (index, e) => {
        const updatedVariants = [...variants];
        const variant = updatedVariants[index];

        if (e.target.name === 'image') {
            const file = e.target.files[0];
            variant.image = file;
            variant.clientImageUrl = file ? URL.createObjectURL(file) : null;
        } else {
            variant[e.target.name] = e.target.value;
        }
        setVariants(updatedVariants);
    };

    const handleSelectFromMedia = (file) => {
        if (activeVariantIndex === null) return;
        const updatedVariants = [...variants];
        const variantToUpdate = { ...updatedVariants[activeVariantIndex] };

        // MediaFile entity uses 'url' field, not 'imageUrl'
        variantToUpdate.imageUrl = file.url;
        variantToUpdate.clientImageUrl = `${VITE_API_BASE_URL}${file.url}`;
        variantToUpdate.image = null; // Clear file input if media is chosen

        updatedVariants[activeVariantIndex] = variantToUpdate;
        setVariants(updatedVariants);
        closeMediaModal();
    };

    const openMediaModal = (index) => {
        setActiveVariantIndex(index);
        setIsMediaModalOpen(true);
    };

    const closeMediaModal = () => {
        setActiveVariantIndex(null);
        setIsMediaModalOpen(false);
    };

    const addVariant = () => {
        setVariants([...variants, { id: null, color: '', size: '', price: '', stockQuantity: '', image: null, clientImageUrl: null, imageUrl: '' }]);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        const productData = { ...product, category: { id: product.categoryId } };

        // Separate variants and their image files
        const variantsData = variants.map(v => ({
            id: v.id,
            color: v.color,
            size: v.size,
            price: v.price,
            stockQuantity: v.stockQuantity,
            imageUrl: v.image ? null : v.imageUrl // If new image is uploaded, its URL will be set by backend
        }));

        formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
        formData.append('variants', new Blob([JSON.stringify(variantsData)], { type: 'application/json' }));

        // Append only newly uploaded image files
        variants.forEach(v => {
            if (v.image) {
                formData.append('images', v.image);
            }
        });

        try {
            await API.put(`/api/admin/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Product updated successfully!');
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating product.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isPageLoading || !product) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }

    return (
        <div>
            <PageHeader title="Update Product" subtitle={`Editing: ${product.name}`} />
            <form onSubmit={handleSubmit}>
                <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                    <h3 className="text-lg font-bold mb-6">Main Product Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Product Name" name="name" value={product.name} onChange={handleProductChange} required />
                        <Input label="Brand" name="brand" value={product.brand} onChange={handleProductChange} required />
                        <Select label="Category" name="categoryId" value={product.categoryId} onChange={handleProductChange} required>
                            <option value="">-- Select Category --</option>
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </Select>
                        <div className="md:col-span-2">
                            <Textarea label="Description" name="description" value={product.description} onChange={handleProductChange} rows="4" required />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {variants.map((variant, index) => {
                        const previewUrl = variant.clientImageUrl || (variant.imageUrl ? `${VITE_API_BASE_URL}${variant.imageUrl}` : null);
                        return (
                            <div key={variant.id || `new-${index}`} className="bg-white p-8 rounded-lg shadow-md relative">
                                <h3 className="text-lg font-bold mb-6">Variant {index + 1}</h3>
                                {variants.length > 1 && (
                                    <Button type="button" variant="ghost" className="absolute top-6 right-6" onClick={() => removeVariant(index)}><i className="bi bi-x-lg"></i></Button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="Color" name="color" value={variant.color} onChange={e => handleVariantChange(index, e)} required />
                                    <Input label="Size" name="size" value={variant.size} onChange={e => handleVariantChange(index, e)} required />
                                    <Input label="Price (EGP)" name="price" type="number" step="0.01" value={variant.price} onChange={e => handleVariantChange(index, e)} required />
                                    <Input label="Stock Quantity" name="stockQuantity" type="number" value={variant.stockQuantity} onChange={e => handleVariantChange(index, e)} required />
                                    <div className="md:col-span-2 grid grid-cols-3 gap-6 items-end">
                                        <div className="col-span-2">
                                            <Input label="Change Image (Optional)" name="image" type="file" onChange={e => handleVariantChange(index, e)} accept="image/*" />
                                            <Button type="button" variant="outline" onClick={() => openMediaModal(index)} className="mt-2 text-sm">Or Choose from Media Library</Button>
                                        </div>
                                        {previewUrl && (
                                            <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <Button type="button" variant="secondary" onClick={addVariant}>Add Another Variant</Button>
                    <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Spinner size="sm" color="white" /> : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </form>
            <Modal isOpen={isMediaModalOpen} onClose={closeMediaModal} title="Select Media" size="4xl">
                <div className="h-[70vh] overflow-y-auto p-1">
                    <MediaManager mode="select" onSelect={handleSelectFromMedia} />
                </div>
            </Modal>
        </div>
    );
};

export default UpdateProduct;