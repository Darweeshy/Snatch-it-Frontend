import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Container from '../ui/Container';
import Logo from './Logo';
import Button from '../ui/Button';
import NavDropdown from './NavDropdown';
import MobileMenu from './MobileMenu';
import API from '../../api/client';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);

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

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
                    ? 'bg-white shadow-md'
                    : 'bg-white/95 backdrop-blur-md shadow-sm'
                }`}
        >
            {/* Top Bar - Egyptian Gold Accent */}
            <div className="bg-[var(--color-primary-navy)] text-white py-2 hidden md:block">
                <Container>
                    <div className="flex items-center justify-between text-sm">
                        <p className="flex items-center gap-2">
                            <span className="text-[var(--color-primary-gold)]">✨</span>
                            <span>Discover Egypt's Finest Local Brands</span>
                        </p>
                        <div className="flex items-center gap-4">
                            <Link to="/about" className="hover:text-[var(--color-primary-gold)] transition-colors">
                                About Us
                            </Link>
                            <Link to="/contact" className="hover:text-[var(--color-primary-gold)] transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Main Navigation */}
            <Container>
                <div className="flex items-center justify-between h-20">
                    {/* Left: Logo & Desktop Nav */}
                    <div className="flex items-center gap-8">
                        <Logo />

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {categories.map(category => (
                                <NavDropdown key={category.id} category={category} />
                            ))}
                        </nav>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search Icon - Desktop */}
                        <button
                            className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 transition-colors touch-target"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5 text-[var(--color-neutral-gray)]" />
                        </button>

                        {/* Desktop User Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            {user ? (
                                <>
                                    <span className="text-sm text-[var(--color-neutral-gray)]">
                                        Hi, <span className="font-semibold text-[var(--color-primary-navy)]">{user.username}</span>!
                                    </span>

                                    <NavLink
                                        to="/account/orders"
                                        className={({ isActive }) =>
                                            `text-sm font-medium transition-colors ${isActive
                                                ? 'text-[var(--color-primary-teal)]'
                                                : 'text-[var(--color-neutral-gray)] hover:text-[var(--color-primary-teal)]'
                                            }`
                                        }
                                    >
                                        My Orders
                                    </NavLink>

                                    {user.role === 'ROLE_ADMIN' && (
                                        <Button
                                            onClick={() => navigate('/admin')}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Dashboard
                                        </Button>
                                    )}

                                    <Button
                                        onClick={handleLogout}
                                        variant="secondary"
                                        size="sm"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => navigate('/login')}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        onClick={() => navigate('/register')}
                                        className="btn-primary"
                                        size="sm"
                                    >
                                        Register
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors touch-target group"
                            aria-label="Shopping cart"
                        >
                            <ShoppingCart className="w-6 h-6 text-[var(--color-neutral-gray)] group-hover:text-[var(--color-primary-teal)] transition-colors" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-[var(--color-primary-teal)] rounded-full animate-pulse-glow">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu */}
                        <MobileMenu
                            categories={categories}
                            user={user}
                            onLogout={handleLogout}
                            onNavigate={navigate}
                        />
                    </div>
                </div>
            </Container>
        </header>
    );
};

export default Navbar;