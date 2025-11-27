import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Dashboard.css'; // Import the new CSS file

const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <h2 className="sidebar-title">Admin Menu</h2>
                <nav className="sidebar-nav">
                    <NavLink to="/admin-dashboard" end>Overview</NavLink>
                    <NavLink to="/admin-dashboard/categories">Manage Categories</NavLink>
                    <NavLink to="/admin-dashboard/products">Manage Products</NavLink>
                    <NavLink to="/admin-dashboard/coupons">Manage Coupons</NavLink> {/* <-- ADD THIS LINE */}
                </nav>
            </aside>
            <main className="dashboard-content">
                <Outlet /> {/* Child admin pages will render here */}
            </main>
        </div>
    );
};

export default DashboardLayout;