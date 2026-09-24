import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { 
  Home, Grid, PlusSquare, MapPin, 
  Users, Wrench, MessageSquare, LogOut 
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { name: 'Properties', path: '/admin/properties', icon: Grid },
    { name: 'Add Property', path: '/admin/properties/add', icon: PlusSquare },
    { name: 'Locations', path: '/admin/locations', icon: MapPin },
    { name: 'Partners', path: '/admin/partners', icon: Users },
    { name: 'Services', path: '/admin/services', icon: Wrench },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[var(--color-primary)] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col shadow-2xl lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo Area */}
        <div className="flex items-center justify-center h-20 border-b border-white/10 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <Home size={24} className="text-[var(--color-secondary)]" />
            <span className="text-xl font-extrabold tracking-tight">
              Home<span className="text-[var(--color-secondary)]">Space</span> Admin
            </span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/admin/properties'
              ? location.pathname === '/admin/properties' || location.pathname.startsWith('/admin/properties/edit')
              : location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center px-4 py-3 text-[14px] font-semibold rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-inner border border-white/5' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`mr-3 shrink-0 h-5 w-5 transition-colors ${
                  isActive ? 'text-[var(--color-secondary)]' : 'text-white/40 group-hover:text-white/80'
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Pinned Logout */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            onClick={logout}
            className="w-full group flex items-center px-4 py-3 text-[14px] font-semibold rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20"
          >
            <LogOut className="mr-3 shrink-0 h-5 w-5 text-red-500 group-hover:text-red-400" />
            Logout
          </button>
        </div>
        
      </div>
    </>
  );
};

export default AdminSidebar;
