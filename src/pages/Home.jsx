import { useState, useEffect } from 'react';
import API from '../api/client';
import Container from '../components/ui/Container';
import Spinner from '../components/ui/Spinner';
import CategoryCard from '../components/shared/CategoryCard';
import HeroSlider from '../components/shared/HeroSlider';
import toast from 'react-hot-toast';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, bannersRes] = await Promise.all([
                    API.get('/api/categories/toplevel'),
                    API.get('/api/banners').catch(() => ({ data: [] })) // Fallback if banners endpoint fails
                ]);
                setCategories(categoriesRes.data);
                setBanners(bannersRes.data);
            } catch (err) {
                toast.error('Failed to load homepage data.');
                console.error("Error fetching data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Spinner size="lg" /></div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Slider Section */}
            {banners && banners.length > 0 && (
                <Container className="py-8">
                    <HeroSlider banners={banners} />
                </Container>
            )}

            {/* Shop by Category Section */}
            <Container className="py-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Shop by <span className="gradient-text">Category</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover our curated collection of premium products across all categories
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map(category => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </Container>

            {/* Features Section */}
            <div className="bg-gradient-to-r from-[#2D3142] to-[#4F5D75] py-16 mt-16">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-[#EF8354] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Quality Guaranteed</h3>
                            <p className="text-gray-300">Premium products with verified quality</p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-[#EF8354] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                            <p className="text-gray-300">Quick shipping to your doorstep</p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-[#EF8354] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
                            <p className="text-gray-300">Safe and encrypted transactions</p>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default Home;