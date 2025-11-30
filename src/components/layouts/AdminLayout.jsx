import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const navLinkClasses = 'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors';
  const activeClass = 'bg-primary-600 text-white';
  const inactiveClass = 'text-secondary-100 hover:bg-secondary-700 hover:text-white';

  return (
    <div className="flex h-screen bg-secondary-100">
      <aside className="w-64 flex-shrink-0 bg-secondary-800 p-4">
        <div className="flex items-center mb-8">
          <a href="/" className="text-white font-bold text-2xl">Snatch Up</a>
          <span className="ml-2 text-xs font-semibold uppercase text-primary-400">Admin</span>
        </div>
        <nav className="space-y-2">
          <NavLink to="/admin" end className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}>
            <i className="bi bi-grid-1x2-fill mr-3"></i>
            Overview
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}>
            <i className="bi bi-box-seam-fill mr-3"></i>
            Products
          </NavLink>
          <NavLink to="/admin/categories" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}>
            <i className="bi bi-tag-fill mr-3"></i>
            Categories
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}>
            <i className="bi bi-receipt-cutoff mr-3"></i>
            Orders
          </NavLink>
          <NavLink to="/admin/coupons" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}>
            <i className="bi bi-tag-fill mr-3"></i>
            Coupons
          </NavLink>
          <NavLink to="/admin/pages" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}>
            <i className="bi bi-file-earmark-text-fill mr-3"></i>
            Content Pages
          </NavLink>
          {/* --- NEW MEDIA LINK --- */}
          <NavLink to="/admin/media" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}>
            <i className="bi bi-images mr-3"></i>
            Media
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;