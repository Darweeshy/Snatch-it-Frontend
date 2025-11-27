// ========== FILE: src/pages/admin/media/MediaManager.jsx ==========
import { useState, useEffect } from 'react';
import API from '@/api/client';
import toast from 'react-hot-toast';

import PageHeader from '@/components/shared/PageHeader';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import MediaGallery from '@/pages/admin/media/MediaGallery';
import FolderSidebar from '@/pages/admin/media/FolderSidebar';


const MediaManager = ({ mode = 'manage', onSelect }) => {
    const [media, setMedia] = useState([]);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [pagination, setPagination] = useState({ page: 0, totalPages: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    
    const fetchFolders = async () => {
        try {
            const res = await API.get('/api/admin/media/folders');
            setFolders(res.data);
        } catch (error) {
            toast.error("Could not fetch media folders.");
        }
    };

    const fetchMedia = async (page = 0) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page,
                size: 20,
                sort: 'uploadedAt,desc'
            });
            if (selectedFolder) {
                params.append('folder', selectedFolder);
            }
            const res = await API.get(`/api/admin/media?${params.toString()}`);
            setMedia(res.data.content);
            setPagination({ page: res.data.number, totalPages: res.data.totalPages });
        } catch (error) {
            toast.error("Could not fetch media files.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFolders();
    }, []);

    useEffect(() => {
        fetchMedia(0);
    }, [selectedFolder]);
    
    const handleUpload = async (files, folder) => {
        if (!files.length) return;
        if (!folder || !folder.trim()) {
            toast.error("Please enter a folder name for the upload.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        for (const file of files) {
            formData.append('files', file);
        }
        formData.append('folder', folder);

        try {
            await API.post('/api/admin/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success("Files uploaded successfully!");
            await fetchFolders(); // Refresh folder list
            // If the user is in the folder they just uploaded to, refresh the media
            if(selectedFolder === null || selectedFolder === folder.trim().toLowerCase()) {
                await fetchMedia(0);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to upload files.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileClick = (file) => {
        if (mode === 'select' && onSelect) {
            onSelect(file);
        }
    };
    
    const handleDelete = async (fileId) => {
        if (window.confirm("Are you sure you want to delete this file? This cannot be undone.")) {
            try {
                await API.delete(`/api/admin/media/${fileId}`);
                toast.success("File deleted successfully.");
                setMedia(prev => prev.filter(f => f.id !== fileId));
            } catch (error) {
                toast.error("Could not delete file.");
            }
        }
    };

    const handleMakePublic = async (fileId) => {
         try {
            await API.post(`/api/admin/media/${fileId}/make-public`);
            toast.success("File is now public.");
            setMedia(prev => prev.map(f => f.id === fileId ? { ...f, isPublic: true } : f));
        } catch (error) {
            toast.error("Could not make file public.");
        }
    }

    return (
        <div className={mode === 'manage' ? '' : 'flex flex-col h-full'}>
            {mode === 'manage' && <PageHeader title="Media Library" />}
            
            <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
                <div className="md:col-span-1">
                    <FolderSidebar 
                        folders={folders}
                        selectedFolder={selectedFolder}
                        onSelectFolder={setSelectedFolder}
                        onUpload={handleUpload}
                        isUploading={isUploading}
                    />
                </div>
                <div className="md:col-span-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full"><Spinner size="lg" /></div>
                    ) : (
                        <MediaGallery 
                            files={media}
                            onFileClick={handleFileClick}
                            onDelete={mode === 'manage' ? handleDelete : null}
                            onMakePublic={mode === 'manage' ? handleMakePublic : null}
                            selectable={mode === 'select'}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaManager;