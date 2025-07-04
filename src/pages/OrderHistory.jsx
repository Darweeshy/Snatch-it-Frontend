import { useState, useEffect } from 'react';
import API from '../api/client';
import toast from 'react-hot-toast';

import Container from '../components/ui/Container';
import PageHeader from '../components/shared/PageHeader';
import Spinner from '../components/ui/Spinner';
import { formatCurrency } from '../utils/formatCurrency';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await API.get('/api/profile/orders');
                setOrders(response.data);
            } catch (error) {
                toast.error("Failed to fetch order history.");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserOrders();
    }, []);

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'PENDING_PAYMENT': return 'bg-gray-100 text-gray-800';
            case 'PAYMENT_FAILED': return 'bg-red-100 text-red-800';
            case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
            case 'SHIPPED': return 'bg-blue-100 text-blue-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            default: return 'bg-secondary-100 text-secondary-800';
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Spinner size="lg" /></div>;
    }

    return (
        <Container className="py-12">
            <PageHeader title="My Orders" subtitle="View your past and current orders" />
            
            <div className="space-y-8">
                {orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex flex-col sm:flex-row justify-between border-b pb-4 mb-4 gap-4">
                                <div>
                                    <h3 className="font-bold text-lg">Order #{order.orderTrackingNumber.substring(0, 8).toUpperCase()}</h3>
                                    <p className="text-sm text-secondary-500">Placed on: {new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-sm text-secondary-500">Total: {formatCurrency(order.totalPrice)}</p>
                                    <span className={`mt-1 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                            <ul className="divide-y divide-secondary-100">
                                {order.orderItems.map((item, index) => (
                                    <li key={index} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{item.productName}</p>
                                            <p className="text-sm text-secondary-500">{item.variantColor} / {item.variantSize}</p>
                                        </div>
                                        <p className="text-sm text-secondary-600">{item.quantity} x {formatCurrency(item.price)}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-secondary-500">You have not placed any orders yet.</p>
                )}
            </div>
        </Container>
    );
};

export default OrderHistory;