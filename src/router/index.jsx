import { Routes, Route } from "react-router-dom";

// Layouts & Route Protections
import MainLayout from "@/components/layouts/MainLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import Home from "@/pages/Home";
import DynamicPage from "@/pages/DynamicPage";
import CategoryPage from "@/pages/CategoryPage";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentFailure from "@/pages/PaymentFailure";
import OrderHistory from "@/pages/OrderHistory";
import TrackOrderPage from "@/pages/TrackOrderPage";
import AccessDenied from "@/pages/AccessDenied";
import NotFound from "@/pages/NotFound";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// Admin Pages
import Dashboard from "@/pages/admin/Dashboard";
import ManageCategories from "@/pages/admin/ManageCategories";
import CategoryEditor from "@/pages/admin/CategoryEditor";
import ManageProducts from "@/pages/admin/ManageProducts";
import AddProduct from "@/pages/admin/AddProduct";
import UpdateProduct from "@/pages/admin/UpdateProduct";
import ManageOrders from "@/pages/admin/ManageOrders";
import OrderDetails from "@/pages/admin/OrderDetails";
import ManagePages from "@/pages/admin/ManagePages";
import PageEditor from "@/pages/admin/PageEditor";
import ManageCoupons from "@/pages/admin/ManageCoupons";
import CouponEditor from "@/pages/admin/CouponEditor";
import MediaManager from "@/pages/admin/media/MediaManager";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/page/:slug" element={<DynamicPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/cart" element={<Cart />} />
        
        {/* FIX: Guest Checkout is now public */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/payment-success" element={<PaymentSuccess />} />
        <Route path="/order/payment-failure" element={<PaymentFailure />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/account/orders" element={<OrderHistory />} />
        </Route>
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/update/:id" element={<UpdateProduct />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="categories/new" element={<CategoryEditor />} />
          <Route path="categories/edit/:id" element={<CategoryEditor />} />
          <Route path="pages" element={<ManagePages />} />
          <Route path="pages/new" element={<PageEditor />} />
          <Route path="pages/edit/:id" element={<PageEditor />} />
          <Route path="coupons" element={<ManageCoupons />} />
          <Route path="coupons/new" element={<CouponEditor />} />
          <Route path="media" element={<MediaManager />} />
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;