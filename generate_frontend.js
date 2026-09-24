const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const dirs = [
  'components/layout',
  'components/home',
  'components/property',
  'components/admin',
  'pages/public',
  'pages/admin',
  'context',
  'services',
  'routes',
  'utils'
];

dirs.forEach(d => fs.mkdirSync(path.join(srcDir, d), { recursive: true }));

const files = {
  'routes/AppRoutes.jsx': `import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

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
import ManageLocations from '../pages/admin/ManageLocations';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:slug" element={<PropertyDetail />} />
      <Route path="/services" element={<Services />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/bank-auction" element={<BankAuction />} />
      <Route path="/pre-leased" element={<PreLeased />} />

      {/* Admin Auth */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/properties" element={<ManageProperties />} />
        <Route path="/admin/properties/add" element={<AddProperty />} />
        <Route path="/admin/locations" element={<ManageLocations />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;`,

  'routes/ProtectedRoute.jsx': `import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Placeholder for auth check
  const isAuthenticated = true;
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;`,

  'pages/public/Home.jsx': `const Home = () => <div className="p-4 sm:p-8"><h1>Home</h1></div>; export default Home;`,
  'pages/public/Properties.jsx': `const Properties = () => <div className="p-4 sm:p-8"><h1>Properties</h1></div>; export default Properties;`,
  'pages/public/PropertyDetail.jsx': `const PropertyDetail = () => <div className="p-4 sm:p-8"><h1>Property Detail</h1></div>; export default PropertyDetail;`,
  'pages/public/Services.jsx': `const Services = () => <div className="p-4 sm:p-8"><h1>Services</h1></div>; export default Services;`,
  'pages/public/About.jsx': `const About = () => <div className="p-4 sm:p-8"><h1>About</h1></div>; export default About;`,
  'pages/public/Contact.jsx': `const Contact = () => <div className="p-4 sm:p-8"><h1>Contact</h1></div>; export default Contact;`,
  'pages/public/BankAuction.jsx': `const BankAuction = () => <div className="p-4 sm:p-8"><h1>Bank Auction</h1></div>; export default BankAuction;`,
  'pages/public/PreLeased.jsx': `const PreLeased = () => <div className="p-4 sm:p-8"><h1>Pre Leased</h1></div>; export default PreLeased;`,

  'pages/admin/AdminLogin.jsx': `const AdminLogin = () => <div className="p-4"><h1>Admin Login</h1></div>; export default AdminLogin;`,
  'pages/admin/AdminSignup.jsx': `const AdminSignup = () => <div className="p-4"><h1>Admin Signup</h1></div>; export default AdminSignup;`,
  'pages/admin/Dashboard.jsx': `const Dashboard = () => <div className="p-4"><h1>Admin Dashboard</h1></div>; export default Dashboard;`,
  'pages/admin/ManageProperties.jsx': `const ManageProperties = () => <div className="p-4"><h1>Manage Properties</h1></div>; export default ManageProperties;`,
  'pages/admin/AddProperty.jsx': `const AddProperty = () => <div className="p-4"><h1>Add Property</h1></div>; export default AddProperty;`,
  'pages/admin/ManageLocations.jsx': `const ManageLocations = () => <div className="p-4"><h1>Manage Locations</h1></div>; export default ManageLocations;`,

  'App.jsx': `import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;`,

  'main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(srcDir, filename), content);
}

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply scroll-smooth;
  }
}
`;

fs.writeFileSync(path.join(__dirname, 'frontend', 'tailwind.config.js'), tailwindConfig);
fs.writeFileSync(path.join(__dirname, 'frontend', 'src', 'index.css'), indexCss);

console.log('Frontend scaffolding completed.');
