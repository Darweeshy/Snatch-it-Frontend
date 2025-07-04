import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Container from '../ui/Container';
import Logo from './Logo';
import Button from '../ui/Button';
import NavDropdown from './NavDropdown';
import API from '../../api/client';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories for navbar:", error);
            }
        };
        fetchCategories();
    }, []);


    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const navLinkClasses = 'text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors';
    const activeNavLinkClasses = 'text-primary-600';

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
            <Container>
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-8">
                        <Logo />
                        <nav className="hidden md:flex items-center">
                            {categories.map(category => (
                                <NavDropdown key={category.id} category={category} />
                            ))}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-secondary-600 hidden sm:block">Hi, {user.username}!</span>
                                
                                <NavLink to="/account/orders" className={({isActive}) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                                    My Orders
                                </NavLink>
                                
                                {user.role === 'ROLE_ADMIN' && <Button onClick={() => navigate('/admin')} variant="outline">Dashboard</Button>}
                                
                                <Button onClick={handleLogout} variant="secondary">Logout</Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button onClick={() => navigate('/login')} variant="ghost">Login</Button>
                                <Button onClick={() => navigate('/register')} variant="primary">Register</Button>
                            </div>
                        )}

                        <Link to="/cart" className="relative p-2 rounded-full text-secondary-600 hover:bg-secondary-100 transition-colors">
                            <i className="bi bi-cart3 text-xl"></i>
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-600 rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </Container>
        </header>
    );
};

export default Navbar;