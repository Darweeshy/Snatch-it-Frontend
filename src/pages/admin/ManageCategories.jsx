import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';
import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';

const CategoryRow = ({ category, level = 0, onArchiveClick }) => {
    const navigate = useNavigate();
    const isArchived = category.archived;

    return (
        <>
            <tr className={`transition-colors duration-200 ${isArchived ? 'bg-zinc-100 text-zinc-500' : 'hover:bg-zinc-50'}`}>
                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium" style={{ paddingLeft: `${1 + level * 1.5}rem` }}>
                    {level > 0 && <span className="mr-2 text-zinc-400">↳</span>}
                    <span className={isArchived ? 'line-through' : 'text-zinc-900'}>{category.name}</span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm max-w-sm truncate">{category.description}</td>
                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/admin/categories/edit/${category.id}`)}>Edit</Button>
                    <Button 
                        variant={isArchived ? "secondary" : "danger"} 
                        size="sm"
                        onClick={() => onArchiveClick(category)}>
                        {isArchived ? 'Unarchive' : 'Archive'}
                    </Button>
                </td>
            </tr>
            {/* Recursively render children if they exist */}
            {category.children && category.children.map(child => (
                <CategoryRow key={child.id} category={child} level={level + 1} onArchiveClick={onArchiveClick} />
            ))}
        </>
    );
};

const ManageCategories = () => {
    const [categoryTree, setCategoryTree] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryToToggle, setCategoryToToggle] = useState(null);
    const navigate = useNavigate();
    
    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            // FIX: API now returns a pre-built tree. No more client-side logic needed.
            const response = await API.get('/api/admin/categories');
            setCategoryTree(response.data);
        } catch (error) {
            toast.error('Failed to fetch categories.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleToggleArchive = async () => {
        if (!categoryToToggle) return;
        try {
            await API.put(`/api/admin/categories/${categoryToToggle.id}/archive`);
            toast.success(`Category "${categoryToToggle.name}" status updated successfully.`);
            // Refresh the whole tree from the authoritative source (backend)
            fetchCategories(); 
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update category status.');
        } finally {
            setCategoryToToggle(null);
        }
    };

    const modalActionText = categoryToToggle?.archived ? 'Unarchive' : 'Archive';

    return (
        <div>
            <PageHeader title="Manage Categories">
                <Button onClick={() => navigate('/admin/categories/new')}>
                    <i className="bi bi-plus-lg mr-2"></i> Create New Category
                </Button>
            </PageHeader>

            {isLoading ? (
                <div className="flex justify-center p-10"><Spinner size="lg" /></div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-zinc-200">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {categoryTree.map(category => (
                                <CategoryRow key={category.id} category={category} onArchiveClick={setCategoryToToggle} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={!!categoryToToggle} onClose={() => setCategoryToToggle(null)} title={`${modalActionText} Category`}>
                <p>Are you sure you want to {modalActionText.toLowerCase()} the category "<strong>{categoryToToggle?.name}</strong>"?</p>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setCategoryToToggle(null)}>Cancel</Button>
                    <Button variant={modalActionText === 'Archive' ? 'danger' : 'primary'} onClick={handleToggleArchive}>{modalActionText}</Button>
                </div>
            </Modal>
        </div>
    );
};

export default ManageCategories;