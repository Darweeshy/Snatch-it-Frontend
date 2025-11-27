// ========== FILE: src/components/admin/media/FolderSidebar.jsx ==========
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';

const FolderSidebar = ({ folders, selectedFolder, onSelectFolder, onUpload, isUploading }) => {
    const [uploadFiles, setUploadFiles] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');

    const handleFileChange = (e) => {
        setUploadFiles([...e.target.files]);
    };

    const handleUploadClick = () => {
        onUpload(uploadFiles, newFolderName);
        setUploadFiles([]);
        setNewFolderName('');
    };

    return (
        <aside className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
            <h3 className="font-bold text-lg mb-4">Folders</h3>
            <ul className="space-y-1 flex-grow overflow-y-auto">
                <li
                    onClick={() => onSelectFolder(null)}
                    className={`p-2 rounded-md cursor-pointer text-sm ${!selectedFolder ? 'bg-primary-100 text-primary-700 font-semibold' : 'hover:bg-secondary-100'}`}
                >
                    All Files
                </li>
                {folders.map(folder => (
                    <li key={folder}
                        onClick={() => onSelectFolder(folder)}
                        className={`p-2 rounded-md cursor-pointer text-sm capitalize ${selectedFolder === folder ? 'bg-primary-100 text-primary-700 font-semibold' : 'hover:bg-secondary-100'}`}
                    >
                        {folder}
                    </li>
                ))}
            </ul>

            <div className="mt-6 border-t pt-4">
                <h4 className="font-bold mb-2">Upload New Files</h4>
                <div className="space-y-4">
                    <Input type="file" multiple onChange={handleFileChange} disabled={isUploading} />
                    <Input 
                        placeholder="New or existing folder name..." 
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        disabled={isUploading}
                    />
                    <Button onClick={handleUploadClick} className="w-full" disabled={isUploading || !uploadFiles.length || !newFolderName.trim()}>
                        {isUploading ? <Spinner size="sm" color="white" /> : "Upload"}
                    </Button>
                </div>
            </div>
        </aside>
    );
};

export default FolderSidebar;