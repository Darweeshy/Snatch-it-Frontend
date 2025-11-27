import React, { useState } from 'react';
import API from '../../../api/client';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Spinner from '../../../components/ui/Spinner';

const UploadWidget = ({ onUploadSuccess }) => {
    const [files, setFiles] = useState([]);
    const [folder, setFolder] = useState('general');
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles([...e.target.files]);
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error("Please select files to upload.");
            return;
        }
        if (!folder.trim()) {
            toast.error("Please enter a folder name.");
            return;
        }
        setIsLoading(true);
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        formData.append('folder', folder);

        try {
            await API.post('/api/admin/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success(`${files.length} file(s) uploaded successfully!`);
            onUploadSuccess();
            setFiles([]);
            const fileInput = document.getElementById('file-upload-input');
            if(fileInput) fileInput.value = "";
        } catch (error) {
            toast.error("Upload failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-bold mb-4">Upload New Media</h3>
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                    <Input
                        id="file-upload-input"
                        label="Select Files (Multiple Allowed)"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>
                <Input
                    label="Folder Name"
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                    placeholder="e.g., shoes, tops"
                />
            </div>
            <div className="mt-4 flex justify-end">
                <Button onClick={handleUpload} disabled={isLoading || files.length === 0}>
                    {isLoading ? <Spinner size="sm" color="white" /> : 'Upload'}
                </Button>
            </div>
        </div>
    );
};

export default UploadWidget;