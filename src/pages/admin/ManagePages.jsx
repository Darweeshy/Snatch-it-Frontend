import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';

const ManagePages = () => {
    const [pages, setPages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageToDelete, setPageToDelete] = useState(null);
    const navigate = useNavigate();

    const fetchPages = async () => {
        setIsLoading(true);
        try {
            const response = await API.get('/api/admin/pages');
            setPages(response.data);
        } catch (error) {
            toast.error('Failed to fetch content pages.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleDelete = async () => {
        if (!pageToDelete) return;
        try {
            await API.delete(`/api/admin/pages/${pageToDelete.id}`);
            toast.success(`Page "${pageToDelete.title}" archived successfully.`);
            fetchPages();
        } catch (error) {
            toast.error('Failed to archive page.');
        } finally {
            setPageToDelete(null);
        }
    };

    return (
        <div>
            <PageHeader title="Manage Content Pages">
                <Button onClick={() => navigate('/admin/pages/new')}>
                    <i className="bi bi-plus-lg mr-2"></i>
                    Create New Page
                </Button>
            </PageHeader>

            {isLoading ? (
                <div className="flex justify-center"><Spinner size="lg" /></div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-secondary-200">
                        <thead className="bg-secondary-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">URL Slug</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-200">
                            {pages.map(page => (
                                <tr key={page.id} className="hover:bg-secondary-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">{page.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-secondary-600">/page/{page.slug}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                                        <Button variant="outline" onClick={() => navigate(`/admin/pages/edit/${page.id}`)}>Edit</Button>
                                        <Button variant="danger" onClick={() => setPageToDelete(page)}>Archive</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={!!pageToDelete} onClose={() => setPageToDelete(null)} title="Archive Page">
                <p>Are you sure you want to archive the page "<strong>{pageToDelete?.title}</strong>"?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setPageToDelete(null)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Archive</Button>
                </div>
            </Modal>
        </div>
    );
};

export default ManagePages;