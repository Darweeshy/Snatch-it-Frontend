import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Menu, ChevronDown } from 'lucide-react';

const MobileMenu = ({ categories, user, onLogout, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const toggleCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    const handleNavigation = (path) => {
        closeMenu();
        onNavigate(path);
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors touch-target"
                aria-label="Toggle menu"
            >
                <Menu className="w-6 h-6 text-[var(--color-primary-navy)]" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
                    onClick={closeMenu}
                />
            )}

            {/* Slide-in Menu */}
            <div
                className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[var(--color-primary-navy)]">
                    <h2 className="text-lg font-bold text-white">Menu</h2>
                    <button
                        onClick={closeMenu}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors touch-target"
                        aria-label="Close menu"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Menu Content */}
                <div className="overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">
                    {/* User Section */}
                    {user ? (
                        <div className="p-4 bg-[var(--color-secondary-sand)] border-b border-gray-200">
                            <p className="text-sm text-gray-600 mb-2">Logged in as</p>
                            <p className="font-semibold text-[var(--color-primary-navy)]">{user.username}</p>
                            {user.role === 'ROLE_ADMIN' && (
                                <button
                                    onClick={() => handleNavigation('/admin')}
                                    className="mt-3 w-full btn-outline text-sm py-2"
                                >
                                    Admin Dashboard
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 bg-[var(--color-secondary-sand)] border-b border-gray-200 space-y-2">
                            <button
                                onClick={() => handleNavigation('/login')}
                                className="w-full btn-outline text-sm py-2"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => handleNavigation('/register')}
                                className="w-full btn-primary text-sm py-2"
                            >
                                Register
                            </button>
                        </div>
                    )}

                    {/* Categories */}
                    <div className="py-2">
                        <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Categories
                        </h3>
                        {categories.map((category) => (
                            <div key={category.id}>
                                <button
                                    onClick={() => {
                                        if (category.children && category.children.length > 0) {
                                            toggleCategory(category.id);
                                        } else {
                                            handleNavigation(`/category/${category.id}`);
                                        }
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors touch-target"
                                >
                                    <span className="font-medium text-gray-900">{category.name}</span>
                                    {category.children && category.children.length > 0 && (
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-400 transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''
                                                }`}
                                        />
                                    )}
                                </button>

                                {/* Subcategories */}
                                {category.children && category.children.length > 0 && expandedCategory === category.id && (
                                    <div className="bg-gray-50 border-l-4 border-[var(--color-primary-teal)]">
                                        {category.children.map((child) => (
                                            <button
                                                key={child.id}
                                                onClick={() => handleNavigation(`/category/${child.id}`)}
                                                className="w-full text-left px-8 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700"
                                            >
                                                {child.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Quick Links */}
                    {user && (
                        <div className="py-2 border-t border-gray-200">
                            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Account
                            </h3>
                            <button
                                onClick={() => handleNavigation('/account/orders')}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors touch-target"
                            >
                                <span className="font-medium text-gray-900">My Orders</span>
                            </button>
                            <button
                                onClick={() => {
                                    closeMenu();
                                    onLogout();
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-[var(--color-error)] font-medium touch-target"
                            >
                                Logout
                            </button>
                        </div>
                    )}

                    {/* Footer Links */}
                    <div className="py-2 border-t border-gray-200">
                        <button
                            onClick={() => handleNavigation('/about')}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-600"
                        >
                            About Us
                        </button>
                        <button
                            onClick={() => handleNavigation('/contact')}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-600"
                        >
                            Contact
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileMenu;
