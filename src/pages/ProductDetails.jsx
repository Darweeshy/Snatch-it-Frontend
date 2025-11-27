import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/client';
import { useCart } from '../contexts/CartContext';
import Container from '../components/ui/Container';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                const response = await API.get(`/api/products/${id}`);
                setProduct(response.data);
                if (response.data.variants && response.data.variants.length > 0) {
                    setSelectedVariant(response.data.variants[0]);
                }
            } catch (err) {
                toast.error('Failed to fetch product details.');
                console.error("Error fetching product details:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (selectedVariant) {
            addToCart(selectedVariant, product);
        }
    };
    
    // FIX: The backend provides the full path. We only need to prepend the base URL.
    const imageUrl = selectedVariant?.imageUrl
        ? `${import.meta.env.VITE_API_BASE_URL}${selectedVariant.imageUrl}`
        : "";

    if (isLoading) return <div className="flex justify-center items-center h-96"><Spinner size="lg" /></div>;
    if (!product) return <div className="text-center text-secondary-500 py-10">Product not found or not available.</div>;

    const availableColors = [...new Set(product.variants.map(v => v.color))];
    const availableSizesForColor = product.variants
        .filter(v => v.color === selectedVariant.color)
        .map(v => v.size);

    const handleColorSelect = (color) => {
        const firstVariantOfColor = product.variants.find(v => v.color === color);
        if (firstVariantOfColor) {
            setSelectedVariant(firstVariantOfColor);
        }
    };

    const handleSizeSelect = (size) => {
        const variant = product.variants.find(v => v.color === selectedVariant.color && v.size === size);
        if (variant) {
            setSelectedVariant(variant);
        }
    };

    return (
        <Container className="py-12">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                <div className="aspect-square bg-secondary-100 rounded-lg overflow-hidden">
                    {imageUrl ? (
                        <img src={imageUrl} alt={`${product.name} - ${selectedVariant?.color}`} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-secondary-400">
                            <span className="text-sm">No Image</span>
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-primary-600">{product.brand}</p>
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-secondary-900 mt-2">{product.name}</h1>
                    <div className="mt-4">
                        <p className="text-3xl text-secondary-900 font-bold">{formatCurrency(selectedVariant?.price)}</p>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-secondary-900">Color</h3>
                        <div className="flex items-center gap-2 mt-2">
                            {availableColors.map(color => (
                                <button 
                                    key={color} 
                                    onClick={() => handleColorSelect(color)}
                                    className={`w-8 h-8 rounded-full border-2 transition ${selectedVariant?.color === color ? 'border-primary-600 ring-2 ring-primary-300' : 'border-secondary-200'}`}
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    aria-label={`Select color ${color}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-secondary-900">Size</h3>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {availableSizesForColor.map(size => (
                                <button 
                                    key={size}
                                    onClick={() => handleSizeSelect(size)}
                                    className={`px-4 py-2 rounded-md border text-sm font-medium transition ${selectedVariant?.size === size ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-secondary-700 border-secondary-300 hover:bg-secondary-50'}`}>
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8">
                         <Button 
                            onClick={handleAddToCart}
                            className="w-full py-3 text-base"
                            disabled={!selectedVariant || selectedVariant.stockQuantity === 0}>
                            {selectedVariant?.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                         </Button>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-base font-medium text-secondary-900">Description</h3>
                        <p className="text-secondary-600 mt-2 text-sm leading-relaxed">{product.description}</p>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default ProductDetails;