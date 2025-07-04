// ========== FILE: src/pages/public/Checkout.jsx ==========
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '@/api/client';
import toast from 'react-hot-toast';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext'; // FIX: Add this import line
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import PageHeader from '@/components/shared/PageHeader';
import { formatCurrency } from '@/utils/formatCurrency';

const VITE_PAYMOB_IFRAME_ID = import.meta.env.VITE_PAYMOB_IFRAME_ID;

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({ location: '', countryCode: '+20', phoneNumber: '' });
    const [guestInfo, setGuestInfo] = useState({ guestName: '', guestEmail: ''});
    const [paymentMethod, setPaymentMethod] = useState('PAYMOB');

    useEffect(() => {
        if (cart.length === 0) {
            toast.error("Your cart is empty. Redirecting...");
            navigate('/cart');
        }
    }, [cart, navigate]);

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
    };
    
    const handleGuestChange = (e) => {
        const { name, value } = e.target;
        setGuestInfo(prev => ({...prev, [name]: value}));
    }

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const orderRequest = {
            ...shippingInfo,
            ...guestInfo,
            totalPrice: subtotal,
            paymentMethod,
            orderItems: cart.map(item => ({
                variant: { id: item.id },
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            const response = await API.post('/api/orders/checkout', orderRequest);
            const newOrder = response.data;
            
            if (paymentMethod === 'PAYMOB') {
                const paymentResponse = await API.post('/api/payments/paymob/initiate', { orderId: newOrder.id });
                const paymentKey = paymentResponse.data.payment_key;
                window.location.href = `https://accept.paymob.com/api/acceptance/iframes/${VITE_PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
            } else { // Cash on Delivery
                toast.success('Order placed successfully!');
                clearCart();
                navigate('/order/payment-success');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred during checkout.');
            setIsLoading(false);
        }
    };

    if (cart.length === 0) {
        return <div className="flex justify-center items-center h-96"><Spinner size="lg" /></div>;
    }

    return (
        <Container className="py-12">
            <PageHeader title="Checkout" />
            <form id="checkout-form" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left Column: Forms */}
                    <div className="space-y-8">
                        {!user && (
                            <div className="bg-white p-8 rounded-lg shadow-md">
                                <h2 className="text-xl font-bold mb-6">1. Your Details</h2>
                                <div className="space-y-6">
                                    <Input label="Full Name" name="guestName" value={guestInfo.guestName} onChange={handleGuestChange} required />
                                    <Input label="Email Address" name="guestEmail" type="email" value={guestInfo.guestEmail} onChange={handleGuestChange} required />
                                </div>
                            </div>
                        )}
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-6">2. Shipping Information</h2>
                            <div className="space-y-6">
                                <Input label="Shipping Address / Location" name="location" value={shippingInfo.location} onChange={handleShippingChange} required />
                                <div className="flex gap-4">
                                    <Input label="Country Code" name="countryCode" value={shippingInfo.countryCode} onChange={handleShippingChange} className="w-1/3" required />
                                    <Input label="Phone Number" name="phoneNumber" type="tel" value={shippingInfo.phoneNumber} onChange={handleShippingChange} className="w-2/3" required />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-6">3. Payment Method</h2>
                            <div className="space-y-4">
                                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-secondary-50">
                                    <input type="radio" name="paymentMethod" value="PAYMOB" checked={paymentMethod === 'PAYMOB'} onChange={e => setPaymentMethod(e.target.value)} className="h-5 w-5 text-primary-600 focus:ring-primary-500" />
                                    <span className="ml-4 font-medium">Pay Online (Card / Wallet)</span>
                                </label>
                                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-secondary-50">
                                    <input type="radio" name="paymentMethod" value="CASH_ON_DELIVERY" checked={paymentMethod === 'CASH_ON_DELIVERY'} onChange={e => setPaymentMethod(e.target.value)} className="h-5 w-5 text-primary-600 focus:ring-primary-500" />
                                    <span className="ml-4 font-medium">Cash on Delivery</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Order Summary */}
                    <div className="bg-white p-8 rounded-lg shadow-md self-start">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        <ul className="space-y-4">
                            {cart.map(item => (
                                <li key={item.id} className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-sm text-secondary-500">{item.color} / {item.size} x {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t mt-6 pt-6 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button type="submit" form="checkout-form" className="w-full md:w-auto py-3 px-8 text-base" disabled={isLoading}>
                        {isLoading ? <Spinner size="sm" color="white" /> : 'Place Order'}
                    </Button>
                </div>
            </form>
        </Container>
    );
};

export default Checkout;