import { useState } from 'react';
import API from '../api/client';
import Container from '../components/ui/Container';
import PageHeader from '../components/shared/PageHeader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const TrackOrderPage = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrackOrder = async (e) => {
        e.preventDefault();
        
        // FIX: Sanitize the input by trimming whitespace and removing any '#' characters.
        const cleanTrackingNumber = trackingNumber.trim().replace("#", "");

        if (!cleanTrackingNumber) {
            setError("Please enter a tracking number.");
            return;
        }

        setIsLoading(true);
        setError('');
        setOrder(null);
        try {
            const response = await API.get(`/api/orders/track/${cleanTrackingNumber}`);
            setOrder(response.data);
        } catch (err) {
            // FIX: Provide more specific user-facing error messages.
            if (err.response?.status === 404) {
                setError('Order not found. Please check the tracking number and try again.');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

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

    return (
        <Container className="py-12">
            <PageHeader title="Track Your Order" subtitle="Enter your order tracking number to see its current status." />
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
                    <Input 
                        placeholder="Enter tracking number" 
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="flex-grow"
                        required
                    />
                    <Button type="submit" disabled={isLoading} className="sm:w-auto">
                        {isLoading ? <Spinner size="sm" color="white" /> : 'Track Order'}
                    </Button>
                </form>

                {error && <p className="mt-6 text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
                
                {order && (
                    <div className="mt-8 border-t pt-6">
                        <h3 className="font-bold text-lg">Order Status</h3>
                        <div className="mt-4 space-y-3 text-secondary-700">
                            <div className="flex justify-between">
                                <span>Tracking Number:</span>
                                <span className="font-medium font-mono">{order.orderTrackingNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Order Date:</span>
                                <span className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span>Current Status:</span>
                                <span className={`font-bold ml-2 px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default TrackOrderPage;