import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Spinner from '../../components/ui/Spinner';

const PageEditor = () => {
    const { id } = useParams(); // Will be present if we are editing
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            const fetchPageData = async () => {
                try {
                    const response = await API.get(`/api/admin/pages/${id}`);
                    setTitle(response.data.title);
                    setContent(response.data.content);
                } catch (error) {
                    toast.error("Failed to load page content.");
                    navigate('/admin/pages');
                }
            };
            fetchPageData();
        }
    }, [id, isEditing, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const pageData = { title, content };
        const request = isEditing 
            ? API.put(`/api/admin/pages/${id}`, pageData)
            : API.post('/api/admin/pages', pageData);

        try {
            await request;
            toast.success(`Page ${isEditing ? 'updated' : 'created'} successfully!`);
            navigate('/admin/pages');
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <PageHeader title={isEditing ? 'Edit Page' : 'Create New Page'} />
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <Input label="Page Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., About Us" required />
                <Textarea label="Content (Markdown supported)" value={content} onChange={(e) => setContent(e.target.value)} rows="15" placeholder="## Welcome!..." required />
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={() => navigate('/admin/pages')}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner size="sm" color="white" /> : 'Save Page'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PageEditor;