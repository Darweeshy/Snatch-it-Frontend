import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/client';
import toast from 'react-hot-toast';

import PageHeader from '../../components/shared/PageHeader';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/formatCurrency';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const response = await API.get('/api/admin/orders');
                const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);
            } catch (error) {
                toast.error('Failed to fetch orders.');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
            case 'SHIPPED': return 'bg-blue-100 text-blue-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            default: return 'bg-secondary-100 text-secondary-800';
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Full Tracking ID Copied!');
    };

    return (
        <div>
            <PageHeader title="Manage Orders" subtitle={`A total of ${orders.length} orders found`} />
            {isLoading ? (
                <div className="flex justify-center"><Spinner size="lg" /></div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-secondary-200">
                        <thead className="bg-secondary-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Order #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-200">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-secondary-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-primary-600">
                                        <div className="flex items-center gap-2">
                                            <span>#{order.orderTrackingNumber.substring(0, 8).toUpperCase()}</span>
                                            <button 
                                                onClick={() => copyToClipboard(order.orderTrackingNumber)}
                                                className="p-1 text-secondary-400 hover:text-primary-600"
                                                title="Copy full tracking ID"
                                            >
                                                <i className="bi bi-clipboard"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">{order.customerUsername}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">{formatCurrency(order.totalPrice)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                        <Link to={`/admin/orders/${order.id}`}>
                                            <Button variant="outline">View</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageOrders;