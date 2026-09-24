import { useState, useContext } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AuthContext from '../../context/AuthContext';
import { Menu, Bell, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useContext(AuthContext);

  // Derive title from pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/properties/add')) return 'Add Property';
    if (path.includes('/properties/edit')) return 'Edit Property';
    if (path.includes('/properties')) return 'Manage Properties';
    if (path.includes('/locations')) return 'Manage Locations';
    if (path.includes('/partners')) return 'Manage Partners';
    if (path.includes('/services')) return 'Manage Services';
    if (path.includes('/messages')) return 'Client Messages';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg-primary)] overflow-hidden font-sans">
      
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Column */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="bg-white h-20 border-b border-[var(--color-border-subtle)] flex items-center justify-between px-4 sm:px-8 shrink-0 relative z-10 shadow-sm">
          
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-4 p-2 text-gray-500 hover:text-[var(--color-primary)] hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Messages Quick Link */}
            <Link to="/admin/messages" className="relative p-2 text-gray-400 hover:text-[var(--color-primary)] hover:bg-gray-50 rounded-full transition-colors focus:outline-none" title="Messages">
              <Bell size={20} />
            </Link>
            
            <div className="hidden sm:block w-px h-6 bg-gray-200"></div>
            
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-[13px] font-bold text-[var(--color-text-primary)] leading-tight">{user?.name || 'Admin User'}</p>
                <p className="text-[11px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] flex items-center justify-center overflow-hidden shrink-0">
                {user?.profile_url ? (
                  <img src={user.profile_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={18} className="text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-4 sm:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
