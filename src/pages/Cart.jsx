import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import PageHeader from '../components/shared/PageHeader';
import { formatCurrency } from '../utils/formatCurrency';
import Input from '../components/ui/Input';

// FIX: Renamed variable to be more explicit and avoid conflict.
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, appliedCoupon, applyCoupon, removeCoupon } = useCart();
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discountType === 'PERCENTAGE') {
            discount = (subtotal * appliedCoupon.discountValue) / 100;
        } else {
            discount = appliedCoupon.discountValue;
        }
        discount = Math.min(discount, subtotal);
    }
    
    const total = subtotal - discount;

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        applyCoupon(couponCode);
    };

    return (
        <Container className="py-12">
            <PageHeader title="Your Shopping Cart" />
            
            {cart.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <i className="bi bi-cart-x text-6xl text-secondary-300"></i>
                    <h3 className="text-xl font-semibold text-secondary-800 mt-4">Your cart is empty</h3>
                    <Button onClick={() => navigate('/')} className="mt-6">Continue Shopping</Button>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <ul className="divide-y divide-secondary-200">
                            {cart.map((item) => (
                                <li key={item.id} className="flex items-center py-6 gap-6">
                                    <div className="w-24 h-24 bg-secondary-100 rounded-md overflow-hidden flex-shrink-0">
                                        {/* FIX: Correctly construct the image source URL */}
                                        <img src={`${VITE_API_BASE_URL}${item.imageUrl}`} alt={item.productName} className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-secondary-800">{item.productName}</h3>
                                        <p className="text-sm text-secondary-500">{item.productBrand}</p>
                                        <p className="text-sm text-secondary-500 mt-1">{item.color} / {item.size}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="font-bold text-secondary-900">{formatCurrency(item.price * item.quantity)}</p>
                                        <div className="flex items-center border border-secondary-300 rounded-md">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-secondary-600 hover:bg-secondary-100">-</button>
                                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-secondary-600 hover:bg-secondary-100">+</button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline">Remove</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-lg font-bold mb-4">Have a Coupon?</h2>
                            {appliedCoupon ? (
                                <div>
                                    <p className="text-sm text-green-600">Applied Coupon: <strong>{appliedCoupon.code}</strong></p>
                                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={removeCoupon}>Remove Coupon</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                    <Input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                                    <Button type="submit">Apply</Button>
                                </form>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-28">
                            <h2 className="text-lg font-bold border-b pb-4">Order Summary</h2>
                            <div className="space-y-4 py-4">
                                <div className="flex justify-between text-secondary-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span>- {formatCurrency(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-secondary-600">
                                    <span>Shipping</span>
                                    <span className="font-medium">Free</span>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                                <Button onClick={() => navigate('/checkout')} className="w-full mt-6 py-3">Proceed to Checkout</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default Cart;