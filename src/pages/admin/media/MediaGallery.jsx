// ========== FILE: src/components/admin/media/MediaGallery.jsx ==========
import SecureImage from '@/components/ui/SecureImage';
import Button from '@/components/ui/Button';

const MediaGallery = ({ files, onFileClick, onDelete, onMakePublic, selectable = false }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {files.map(file => (
                <div
                    key={file.id}
                    className={`relative group bg-secondary-100 rounded-lg overflow-hidden shadow-sm border-2 ${selectable ? 'cursor-pointer border-transparent hover:border-primary-500' : 'border-transparent'}`}
                    onClick={() => onFileClick(file)}
                >
                    <div className="aspect-square">
                        <SecureImage
                            src={file.url}
                            alt={file.originalFilename}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                    </div>
                    {onDelete && (
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/80 rounded-bl-lg">
                            {!file.isPublic && onMakePublic && (
                                <Button variant="ghost" size="sm" className="p-1 h-auto" title="Make Public" onClick={(e) => { e.stopPropagation(); onMakePublic(file.id); }}>
                                    <i className="bi bi-unlock"></i>
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" className="p-1 h-auto text-red-600" title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}>
                                <i className="bi bi-trash"></i>
                            </Button>
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-xs text-white truncate">{file.originalFilename}</p>
                        {file.isPublic && <span className="text-xs text-green-300 font-bold">Public</span>}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MediaGallery;