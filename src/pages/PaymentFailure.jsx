import { Link } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';

const PaymentFailure = () => {
    return (
        <Container className="py-12">
            <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <i className="bi bi-x-circle text-4xl text-red-600"></i>
                </div>
                <h2 className="text-2xl font-bold mt-4">Payment Failed</h2>
                <p className="text-secondary-600 mt-2">
                    Unfortunately, there was an issue with your payment. Your order has not been placed. Please try again or contact support.
                </p>
                <Link to="/cart">
                    <Button variant="secondary" className="mt-6">Back to Cart</Button>
                </Link>
            </div>
        </Container>
    );
};
export default PaymentFailure;