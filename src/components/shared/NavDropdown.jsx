import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const NavDropdown = ({ category }) => {
    // State to control the dropdown's visibility
    const [isOpen, setIsOpen] = useState(false);
    // Ref to the dropdown container to detect outside clicks
    const dropdownRef = useRef(null);
    
    const hasChildren = category.children && category.children.length > 0;

    // --- NEW LOGIC ---
    // Function to close the dropdown
    const closeDropdown = () => {
        setIsOpen(false);
    };

    // Effect to add/remove a global click listener
    useEffect(() => {
        // If the dropdown is not open, do nothing
        if (!isOpen) return;

        // Function to handle clicks outside the dropdown
        const handleClickOutside = (event) => {
            // If the click is outside the referenced dropdown element, close it
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };

        // Add the event listener when the dropdown opens
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup function to remove the listener when the component unmounts or dropdown closes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]); // This effect re-runs whenever 'isOpen' changes

    return (
        <div 
            ref={dropdownRef} // Attach the ref to the main container
            className="relative"
            // Open the dropdown on mouse enter
            onMouseEnter={() => setIsOpen(true)}
            // We no longer use onMouseLeave, so it stays open
        >
            <NavLink
                to={`/category/${category.id}`}
                className="p-4 text-sm font-medium text-secondary-700 hover:text-primary-600 flex items-center gap-1"
            >
                {category.name}
                {hasChildren && <i className={`bi bi-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>}
            </NavLink>
            
            {/* Show dropdown if it has children and isOpen is true */}
            {hasChildren && isOpen && (
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-md mt-1 p-2 z-50 w-48 border border-secondary-100">
                    {category.children.map(child => (
                        <NavLink
                            key={child.id}
                            to={`/category/${child.id}`}
                            className="block w-full text-left px-4 py-2 text-sm text-secondary-600 hover:bg-secondary-100 hover:text-primary-600 rounded-md"
                            // When a subcategory is clicked, close the dropdown
                            onClick={closeDropdown}
                        >
                            {child.name}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NavDropdown;