// ========== FILE: src/pages/admin/CategoryEditor.jsx ==========
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
import MediaManager from '@/pages/admin/media/MediaManager';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const CategoryEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [category, setCategory] = useState({
        name: '',
        description: '',
        parentId: '',
        imageUrl: '', // This will hold the URL from the media library or existing URL
    });
    const [imageFile, setImageFile] = useState(null); // For new file uploads
    const [imagePreview, setImagePreview] = useState('');
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(isEditMode);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('/api/admin/categories/flat');
                setCategories(response.data);
            } catch (error) {
                toast.error("Could not load categories for parent selection.");
            }
        };

        const fetchCategoryData = async () => {
            if (isEditMode) {
                try {
                    const { data } = await API.get(`/api/admin/categories/${id}`);
                    setCategory({
                        name: data.name,
                        description: data.description,
                        parentId: data.parentId || '',
                        imageUrl: data.imageUrl || ''
                    });
                    if (data.imageUrl) {
                        setImagePreview(`${VITE_API_BASE_URL}${data.imageUrl}`);
                    }
                } catch (error) {
                    toast.error("Failed to load category data.");
                    navigate('/admin/categories');
                } finally {
                    setIsPageLoading(false);
                }
            }
        };

        fetchCategories();
        fetchCategoryData();
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        setCategory({ ...category, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setCategory(prev => ({ ...prev, imageUrl: '' })); // Clear media library selection
        }
    };

    const handleSelectFromMedia = (file) => {
        setCategory(prev => ({ ...prev, imageUrl: file.imageUrl }));
        setImagePreview(`${VITE_API_BASE_URL}${file.imageUrl}`);
        setImageFile(null); // Clear file input selection
        setIsMediaModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        const categoryData = {
            name: category.name,
            description: category.description,
            parent: category.parentId ? { id: parseInt(category.parentId, 10) } : null,
            imageUrl: category.imageUrl, // Send URL if selected from media
        };
        formData.append('category', new Blob([JSON.stringify(categoryData)], { type: 'application/json' }));
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            if (isEditMode) {
                await API.put(`/api/admin/categories/${id}`, formData);
            } else {
                await API.post('/api/admin/categories', formData);
            }
            toast.success(`Category ${isEditMode ? 'updated' : 'created'} successfully!`);
            navigate('/admin/categories');
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isPageLoading) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }

    return (
        <div>
            <PageHeader title={isEditMode ? `Editing: ${category.name}` : 'Create New Category'} />
            
            <div className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label="Category Name" name="name" value={category.name} onChange={handleChange} required />
                    <Textarea label="Description" name="description" value={category.description} onChange={handleChange} />
                    <Select label="Parent Category (Optional)" name="parentId" value={category.parentId} onChange={handleChange}>
                        <option value="">-- No Parent (Top-Level) --</option>
                        {categories.filter(cat => cat.id !== Number(id)).map(cat => (
                            <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
                        ))}
                    </Select>

                    <div>
                        <Input label={isEditMode ? 'Change Image' : 'Category Image'} type="file" onChange={handleImageChange} accept="image/*" />
                        <Button type="button" variant="outline" onClick={() => setIsMediaModalOpen(true)} className="mt-2 text-sm">Or Choose from Media Library</Button>
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-secondary-600 mb-2">Image Preview:</p>
                                <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md border" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Button type="button" variant="secondary" onClick={() => navigate('/admin/categories')}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Spinner size="sm" color="white" /> : 'Save Category'}
                        </Button>
                    </div>
                </form>
            </div>
            
            <Modal isOpen={isMediaModalOpen} onClose={() => setIsMediaModalOpen(false)} title="Select Media" size="4xl">
                 <div className="h-[70vh] overflow-y-auto p-1">
                     <MediaManager mode="select" onSelect={handleSelectFromMedia} />
                 </div>
            </Modal>
        </div>
    );
};

export default CategoryEditor;