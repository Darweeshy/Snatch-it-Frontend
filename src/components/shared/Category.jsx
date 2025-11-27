import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';

const AddCategory = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        const categoryData = { name, description };
        formData.append('category', new Blob([JSON.stringify(categoryData)], { type: 'application/json' }));
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await API.post('/api/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Category added successfully!');
            navigate('/admin/categories');
        } catch (err) {
            toast.error('Failed to add category.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <PageHeader title="Add New Category" subtitle="Create a new category for your products." />
            <div className="max-w-2xl bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label="Category Name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <Input label="Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    
                    <div>
                        <Input label="Category Image" name="image" type="file" onChange={handleImageChange} accept="image/*" required />
                        {imagePreview && (
                            <div className="mt-4">
                                <img src={imagePreview} alt="Image Preview" className="h-32 w-32 object-cover rounded-md" />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/admin/categories')}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Spinner size="sm" color="white" /> : 'Save Category'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;