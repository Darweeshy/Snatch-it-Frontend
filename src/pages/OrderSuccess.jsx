import { useLocation, Link } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatCurrency';

const OrderSuccess = () => {
    const { state } = useLocation();
    const order = state?.order;

    if (!order) {
        return (
            <Container className="py-12">
                <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold">Thank you for your purchase!</h2>
                    <p className="text-secondary-600 mt-2">You can track your orders from your profile page.</p>
                    <Button as={Link} to="/" className="mt-6">Go to Homepage</Button>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-12">
            <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <i className="bi bi-check2-circle text-4xl text-green-600"></i>
                    </div>
                    <h2 className="text-2xl font-bold mt-4">Order Placed Successfully!</h2>
                    <p className="text-secondary-600 mt-2">Thank you for your purchase, {order.user.username}.</p>
                </div>
                
                <div className="mt-8 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                    <h3 className="font-bold mb-4 text-center">Receipt</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-secondary-600">Order Number:</span>
                            <span className="font-mono font-medium text-primary-700 select-all">{order.orderTrackingNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary-600">Date:</span>
                            <span className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary-600">Total:</span>
                            <span className="font-bold">{formatCurrency(order.totalPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-secondary-600">Status:</span>
                            <span className="font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs uppercase">{order.status}</span>
                        </div>
                    </div>
                </div>

                <Link to="/" className="inline-block w-full text-center mt-8">
                    <Button className="w-full">Continue Shopping</Button>
                </Link>
            </div>
        </Container>
    );
};

export default OrderSuccess;