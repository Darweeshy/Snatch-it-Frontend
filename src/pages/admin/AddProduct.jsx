// ========== FILE: src/pages/admin/AddProduct.jsx ==========
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AddProduct = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState({
        name: "",
        description: "",
        brand: "",
        categoryId: ""
    });
    const [variants, setVariants] = useState([{
        color: "",
        size: "",
        price: "",
        stockQuantity: "",
        image: null,
        clientImageUrl: null,
        imageUrl: ""
    }]);

    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [activeVariantIndex, setActiveVariantIndex] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('/api/admin/categories/flat');
                setCategories(response.data);
            } catch (error) {
                toast.error("Could not load categories.");
            }
        };
        fetchCategories();
    }, []);
    
    const handleProductChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleVariantChange = (index, e) => {
        const updatedVariants = [...variants];
        if (e.target.name === 'image') {
            const file = e.target.files[0];
            updatedVariants[index].image = file;
            updatedVariants[index].clientImageUrl = file ? URL.createObjectURL(file) : null;
            updatedVariants[index].imageUrl = ""; // Clear existing media url if a new file is chosen
        } else {
            updatedVariants[index][e.target.name] = e.target.value;
        }
        setVariants(updatedVariants);
    };

    const handleSelectFromMedia = (file) => {
        if (activeVariantIndex === null) return;
        const updatedVariants = [...variants];
        const variantToUpdate = { ...updatedVariants[activeVariantIndex] };

        variantToUpdate.imageUrl = file.imageUrl;
        variantToUpdate.clientImageUrl = `${import.meta.env.VITE_API_BASE_URL}${file.imageUrl}`;
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
        setVariants([...variants, { color: "", size: "", price: "", stockQuantity: "", image: null, clientImageUrl: null, imageUrl: "" }]);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        const productData = { ...product, category: { id: product.categoryId } };
        const variantData = variants.map(v => ({
            color: v.color,
            size: v.size,
            price: v.price,
            stockQuantity: v.stockQuantity,
            imageUrl: v.imageUrl || null
        }));
        
        const imageFiles = variants.map(v => v.image).filter(Boolean);

        formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
        formData.append('variants', new Blob([JSON.stringify(variantData)], { type: 'application/json' }));
        
        imageFiles.forEach(imageFile => {
            formData.append('images', imageFile);
        });

        try {
            await API.post('/api/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Product added successfully!');
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding product.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <PageHeader title="Add New Product" />
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
                    {variants.map((variant, index) => (
                        <div key={index} className="bg-white p-8 rounded-lg shadow-md relative">
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
                                        <Input label="Variant Image" name="image" type="file" onChange={e => handleVariantChange(index, e)} accept="image/*" />
                                        <Button type="button" variant="outline" onClick={() => openMediaModal(index)} className="mt-2 text-sm">Or Choose from Media Library</Button>
                                    </div>
                                    {variant.clientImageUrl && (
                                        <img src={variant.clientImageUrl} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <Button type="button" variant="secondary" onClick={addVariant}>Add Another Variant</Button>
                    <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Spinner size="sm" color="white" /> : 'Save Product'}
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

export default AddProduct;