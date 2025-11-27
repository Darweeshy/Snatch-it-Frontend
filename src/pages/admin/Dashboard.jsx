import { useState, useEffect } from 'react';
import API from '../../api/client';
import Spinner from '../../components/ui/Spinner';
import PageHeader from '../../components/shared/PageHeader';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/formatCurrency';

const StatCard = ({ title, value, icon, link, linkText }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-secondary-500 uppercase">{title}</p>
            <p className="text-3xl font-bold text-secondary-900 mt-1">{value}</p>
            {link && <Link to={link} className="text-sm font-medium text-primary-600 hover:underline mt-2 inline-block">{linkText}</Link>}
        </div>
        <div className="text-4xl text-primary-300">
            <i className={icon}></i>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        productCount: 0,
        categoryCount: 0,
        totalRevenue: 0,
        pendingOrders: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            const results = await Promise.allSettled([
                API.get('/api/products'),
                API.get('/api/admin/categories/flat'),
                API.get('/api/admin/dashboard/stats')
            ]);

            const productsResult = results[0];
            const categoriesResult = results[1];
            const dashboardStatsResult = results[2];
            
            let newStats = { productCount: 0, categoryCount: 0, totalRevenue: 0, pendingOrders: 0 };

            if (productsResult.status === 'fulfilled') {
                newStats.productCount = productsResult.value.data.totalElements;
            } else {
                console.error("Failed to fetch product stats:", productsResult.reason);
                toast.error("Could not load product stats.");
            }

            if (categoriesResult.status === 'fulfilled') {
                newStats.categoryCount = categoriesResult.value.data.length;
            } else {
                console.error("Failed to fetch category stats:", categoriesResult.reason);
                toast.error("Could not load category stats.");
            }
            
            if (dashboardStatsResult.status === 'fulfilled') {
                newStats.totalRevenue = dashboardStatsResult.value.data.totalRevenue;
                newStats.pendingOrders = dashboardStatsResult.value.data.pendingOrders;
            } else {
                console.error("Failed to fetch dashboard stats:", dashboardStatsResult.reason);
            }

            setStats(newStats);
            setIsLoading(false);
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    }

    return (
        <div>
            <PageHeader title="Dashboard Overview" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Products" 
                    value={stats.productCount} 
                    icon="bi bi-box-seam-fill" 
                    link="/admin/products"
                    linkText="Manage Products"
                />
                <StatCard 
                    title="Total Categories" 
                    value={stats.categoryCount} 
                    icon="bi bi-tags-fill"
                    link="/admin/categories"
                    linkText="Manage Categories"
                 />
                 <StatCard 
                    title="Total Revenue" 
                    value={formatCurrency(stats.totalRevenue)}
                    icon="bi bi-cash-stack"
                />
                 <StatCard 
                    title="Pending Orders" 
                    value={stats.pendingOrders} 
                    icon="bi bi-clock-history" 
                    link="/admin/orders"
                    linkText="View Orders"
                />
            </div>
        </div>
    );
};

export default AdminDashboard;