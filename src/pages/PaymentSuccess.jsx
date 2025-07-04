import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';

const PaymentSuccess = () => {
    const { clearCart } = useCart();

    // Clear the cart once the user lands on this successful payment page
    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <Container className="py-12">
            <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <i className="bi bi-check2-circle text-4xl text-green-600"></i>
                </div>
                <h2 className="text-2xl font-bold mt-4">Payment Successful!</h2>
                <p className="text-secondary-600 mt-2">
                    Thank you for your purchase. Your order is now being processed. You will be able to view it in your order history soon.
                </p>
                <a href="/">
                    <Button className="mt-6">Continue Shopping</Button>
                </a>
            </div>
        </Container>
    );
};

export default PaymentSuccess;