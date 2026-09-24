import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/admin/AdminLayout';

// Public Pages
import Home from '../pages/public/Home';
import Properties from '../pages/public/Properties';
import PropertyDetail from '../pages/public/PropertyDetail';
import Services from '../pages/public/Services';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import BankAuction from '../pages/public/BankAuction';
import PreLeased from '../pages/public/PreLeased';

// Admin Pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminSignup from '../pages/admin/AdminSignup';
import Dashboard from '../pages/admin/Dashboard';
import ManageProperties from '../pages/admin/ManageProperties';
import AddProperty from '../pages/admin/AddProperty';
import EditProperty from '../pages/admin/EditProperty';
import ManageLocations from '../pages/admin/ManageLocations';
import ManagePartners from '../pages/admin/ManagePartners';
import ManageServices from '../pages/admin/ManageServices';
import Messages from '../pages/admin/Messages';



const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:slug" element={<PropertyDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bank-auction" element={<BankAuction />} />
        <Route path="/pre-leased" element={<PreLeased />} />
      </Route>

      {/* Admin Entry Point */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

      {/* Admin Auth */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/properties" element={<ManageProperties />} />
          <Route path="/admin/properties/add" element={<AddProperty />} />
          <Route path="/admin/properties/edit/:id" element={<EditProperty />} />
          <Route path="/admin/locations" element={<ManageLocations />} />
          <Route path="/admin/partners" element={<ManagePartners />} />
          <Route path="/admin/services" element={<ManageServices />} />
          <Route path="/admin/messages" element={<Messages />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;