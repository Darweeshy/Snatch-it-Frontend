import { useState, useEffect } from 'react';
import API from '../api/client';
import Container from '../components/ui/Container';
import Spinner from '../components/ui/Spinner';
import CategoryCard from '../components/shared/CategoryCard';
import PageHeader from '../components/shared/PageHeader';
import toast from 'react-hot-toast';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('/api/categories/toplevel');
                setCategories(response.data);
            } catch (err) {
                toast.error('Failed to load categories.');
                console.error("Error fetching categories:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Spinner size="lg" /></div>;
    }

    return (
        <Container className="py-12">
            <PageHeader 
              title="Shop by Category"
              subtitle="Find the perfect gear for your workout"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map(category => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </Container>
    );
};

export default Home;