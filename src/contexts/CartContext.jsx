import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../api/client'; // Make sure API client is imported

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const getInitialCart = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Could not parse cart from localStorage", error);
    return [];
  }
}

// --- START: NEW ---
const getInitialCoupon = () => {
    try {
        const savedCoupon = localStorage.getItem('coupon');
        return savedCoupon ? JSON.parse(savedCoupon) : null;
    } catch(error) {
        return null;
    }
}
// --- END: NEW ---

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(getInitialCart);
  // --- START: NEW ---
  const [appliedCoupon, setAppliedCoupon] = useState(getInitialCoupon);
  // --- END: NEW ---

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // --- START: NEW ---
  useEffect(() => {
    if (appliedCoupon) {
        localStorage.setItem('coupon', JSON.stringify(appliedCoupon));
    } else {
        localStorage.removeItem('coupon');
    }
  }, [appliedCoupon]);

  const applyCoupon = async (code) => {
    if (!code.trim()) {
        toast.error("Please enter a coupon code.");
        return;
    }
    try {
        const response = await API.post('/api/coupons/validate', { code });
        setAppliedCoupon(response.data);
        toast.success(`Coupon "${response.data.code}" applied successfully!`);
    } catch (error) {
        setAppliedCoupon(null);
        toast.error("Invalid or expired coupon code.");
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success("Coupon removed.");
  }
  // --- END: NEW ---

  const addToCart = (productVariant, productDetails) => {
    setCart((prevCart) => {
        const isItemInCart = prevCart.find(item => item.id === productVariant.id);
        
        if (isItemInCart) {
            return prevCart.map(item =>
                item.id === productVariant.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
          const newItem = {
            ...productVariant,
            quantity: 1,
            productName: productDetails.name,
            productBrand: productDetails.brand
          }
          return [...prevCart, newItem];
        }
    });
    toast.success(`${productDetails.name} (${productVariant.color}, ${productVariant.size}) added to cart!`);
  };

  const removeFromCart = (variantId) => {
      setCart(prev => prev.filter(item => item.id !== variantId));
      toast.error('Item removed from cart');
  };

  const clearCart = () => {
      setCart([]);
      // Also clear the coupon when the cart is cleared
      setAppliedCoupon(null);
  };

  const updateQuantity = (variantId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(variantId);
      return;
    }
    setCart(prev => prev.map(item => item.id === variantId ? { ...item, quantity: newQuantity } : item));
  }

  // Add new state and functions to the context value
  const value = { cart, addToCart, removeFromCart, clearCart, updateQuantity, appliedCoupon, applyCoupon, removeCoupon };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};