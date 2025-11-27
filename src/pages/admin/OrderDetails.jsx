// ========== FILE: src/pages/admin/OrderDetails.jsx ==========
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '@/api/client';
import toast from 'react-hot-toast';

import PageHeader from '@/components/shared/PageHeader';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Select from '@/components/ui/Select';
import { formatCurrency } from '@/utils/formatCurrency';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchOrderDetails = async () => {
        setIsLoading(true);
        try {
            const response = await API.get(`/api/admin/orders/${orderId}`);
            setOrder(response.data);
            setStatus(response.data.status);
        } catch (error) {
            toast.error('Failed to fetch order details.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const handleStatusUpdate = async () => {
        setIsUpdating(true);
        try {
            const response = await API.put(`/api/admin/orders/${orderId}/status`, { status });
            setOrder(response.data);
            toast.success('Order status updated!');
        } catch (error) {
            toast.error('Failed to update status.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
    }

    if (!order) {
        return <div className="text-center">Order not found.</div>;
    }

    const orderStatusOptions = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "PENDING_PAYMENT", "PAYMENT_FAILED"];

    return (
        <div>
            <PageHeader title={`Order #${order.orderTrackingNumber.substring(0, 8).toUpperCase()}`}>
                <Link to="/admin/orders">
                    <Button variant="outline">
                        <i className="bi bi-arrow-left mr-2"></i>Back to All Orders
                    </Button>
                </Link>
            </PageHeader>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold border-b pb-4 mb-4">Order Items</h3>
                    <table className="min-w-full divide-y divide-secondary-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Product</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Variant</th>
                                <th className="px-4 py-2 text-center text-sm font-semibold">Quantity</th>
                                <th className="px-4 py-2 text-right text-sm font-semibold">Unit Price</th>
                                <th className="px-4 py-2 text-right text-sm font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {order.orderItems.map((item) => (
                                <tr key={item.variantId}>
                                    <td className="px-4 py-3 font-medium">{item.productName}</td>
                                    <td className="px-4 py-3 text-secondary-600">{item.variantColor} / {item.variantSize}</td>
                                    <td className="px-4 py-3 text-center text-secondary-600">{item.quantity}</td>
                                    <td className="px-4 py-3 text-right text-secondary-600">{formatCurrency(item.price)}</td>
                                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold border-b pb-4 mb-4">Customer & Order Details</h3>
                        <div className="space-y-2 text-sm">
                            <p><strong>Customer:</strong> {order.customerUsername}</p>
                            <p><strong>Email:</strong> {order.customerEmail}</p>
                            <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                            <p><strong>Phone:</strong> {order.phoneNumber}</p>
                            <p><strong>Payment Method:</strong> <span className="font-semibold ml-1">{order.paymentMethod?.replace("_", " ")}</span></p>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold border-b pb-4 mb-4">Update Status</h3>
                        <div className="flex items-center gap-4">
                            <Select value={status} onChange={e => setStatus(e.target.value)} className="flex-grow">
                                {orderStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            </Select>
                            <Button onClick={handleStatusUpdate} disabled={isUpdating}>
                                {isUpdating ? <Spinner size="sm" color="white" /> : "Update"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;