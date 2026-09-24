import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight, Home } from 'lucide-react';
import Button from '../ui/Button';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Properties', path: '/properties', hasDropdown: true },
  { name: 'Bank Auction', path: '/bank-auction' },
  { name: 'Pre-Leased', path: '/pre-leased' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const propertyCategories = [
  { 
    name: 'Residential', 
    path: '/properties?category=Residential',
    subCategories: [
      { name: 'Flat / Apartment', path: '/properties?category=Residential&type=Flat%20%2F%20Apartment' },
      { name: 'Villa', path: '/properties?category=Residential&type=Villa' },
      { name: 'Raw House', path: '/properties?category=Residential&type=Raw%20House' },
      { name: 'Tenament', path: '/properties?category=Residential&type=Tenament' },
      { name: 'Duplex', path: '/properties?category=Residential&type=Duplex' }
    ]
  },
  { 
    name: 'Commercial', 
    path: '/properties?category=Commercial',
    subCategories: [
      { name: 'Shop', path: '/properties?category=Commercial&type=Shop' },
      { name: 'Independent Plot', path: '/properties?category=Commercial&type=Independent%20Plot' },
      { name: 'Commercial Space', path: '/properties?category=Commercial&type=Commercial%20Space' },
      { name: 'Office', path: '/properties?category=Commercial&type=Office' },
      { name: 'Show Room', path: '/properties?category=Commercial&type=Show%20Room' },
      { name: 'Ware House', path: '/properties?category=Commercial&type=Ware%20House' }
    ]
  },
  { 
    name: 'Pre Leased', 
    path: '/pre-leased',
    subCategories: [
      { name: 'Penthouse', path: '/pre-leased?type=Penthouse' }
    ]
  },
  { divider: true },
  { name: 'Bank Auction', path: '/bank-auction' },
  { name: 'Land', path: '/properties?category=Land' },
  { name: 'Farm House', path: '/properties?category=Farm House' },
  { name: 'Plots', path: '/properties?category=Plots' },
  { name: 'Investments', path: '/properties?category=Investments' },
  { name: 'Loan', path: '/properties?category=Loan' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Make navbar solid white on all pages except home, or on home when scrolled
  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsOpen(!isOpen);

  const navBackground = isTransparent 
    ? 'bg-transparent' 
    : 'bg-white/95 backdrop-blur-md shadow-soft border-b border-[var(--color-border-subtle)]';
    
  const textColor = isTransparent ? 'text-white' : 'text-[var(--color-text-primary)]';

  const NavItem = ({ link }) => {
    const isActive = location.pathname === link.path;
    
    if (link.hasDropdown) {
      return (
        <div className="relative group h-full flex items-center">
          <Link to={link.path} className={`relative flex items-center gap-1.5 px-1 py-2 text-[15px] font-semibold transition-colors ${textColor} hover:opacity-80`}>
            {link.name}
            <ChevronDown size={14} className="mt-0.5 group-hover:rotate-180 transition-transform duration-200" />
            {isActive && (
              <motion.div layoutId="underline" className={`absolute left-0 right-0 bottom-0 h-[2px] ${isTransparent ? 'bg-white' : 'bg-[var(--color-primary)]'}`} />
            )}
            <div className={`absolute left-0 right-0 bottom-0 h-[2px] ${isTransparent ? 'bg-white' : 'bg-[var(--color-primary)]'} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ${isActive ? 'hidden' : ''}`} />
          </Link>
          
          {/* Dropdown Menu */}
          <div className="absolute top-[80px] left-0 w-[240px] bg-white rounded-2xl shadow-hover border border-[var(--color-border-subtle)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 py-3 z-50">
            {propertyCategories.map((cat, idx) => 
              cat.divider ? (
                <div key={`div-${idx}`} className="h-px bg-gray-100 my-2 mx-4" />
              ) : (
                <div key={cat.name} className="relative group/sub">
                  <Link 
                    to={cat.path} 
                    className="flex items-center justify-between px-6 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors"
                  >
                    {cat.name}
                    {cat.subCategories && (
                      <ChevronRight size={14} className="text-gray-400 group-hover/sub:text-[var(--color-primary)]" />
                    )}
                  </Link>
                  {/* Sub Dropdown Menu */}
                  {cat.subCategories && (
                    <div className="absolute top-0 left-[100%] w-[220px] bg-white rounded-2xl shadow-hover border border-[var(--color-border-subtle)] opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 transform -translate-x-2 group-hover/sub:translate-x-0 py-3 z-50 ml-1">
                      {cat.subCategories.map(sub => (
                        <Link 
                          key={sub.name} 
                          to={sub.path} 
                          className="block px-6 py-2.5 text-[14px] font-medium text-gray-600 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex items-center">
        <Link to={link.path} className={`relative group px-1 py-2 text-[15px] font-semibold transition-colors ${textColor} hover:opacity-80`}>
          {link.name}
          {isActive && (
            <motion.div layoutId="underline" className={`absolute left-0 right-0 bottom-0 h-[2px] ${isTransparent ? 'bg-white' : 'bg-[var(--color-primary)]'}`} />
          )}
          <div className={`absolute left-0 right-0 bottom-0 h-[2px] ${isTransparent ? 'bg-white' : 'bg-[var(--color-primary)]'} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ${isActive ? 'hidden' : ''}`} />
        </Link>
      </div>
    );
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBackground}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Home size={20} className="text-[var(--color-secondary)]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight transition-colors flex items-center">
                <span className={`uppercase font-black ${isTransparent ? 'text-white' : 'text-[var(--color-primary)]'}`}>REAL</span>
                <span className="text-[var(--color-secondary)] uppercase ml-1.5 font-bold tracking-wider text-2xl">ESTATE</span>
              </span>
            </Link>
          </div>
            
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8 h-full">
            {navLinks.map((link) => (
              <NavItem key={link.path} link={link} />
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center lg:hidden">
            <button onClick={toggleMobileMenu} className={`focus:outline-none transition-colors ${textColor}`}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed top-24 right-0 bottom-0 w-[300px] bg-white border-l border-[var(--color-border-subtle)] shadow-soft z-50 overflow-y-auto"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <div key={link.path} className="flex flex-col">
                  <Link 
                    to={link.path} 
                    onClick={toggleMobileMenu} 
                    className={`text-lg font-bold ${location.pathname === link.path ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}`}
                  >
                    {link.name}
                  </Link>
                  {link.hasDropdown && (
                    <div className="pl-4 mt-3 flex flex-col gap-3 border-l-2 border-gray-100">
                      {propertyCategories.map((cat, idx) => !cat.divider && (
                        <div key={cat.name} className="flex flex-col gap-2">
                          <Link 
                            to={cat.path}
                            onClick={toggleMobileMenu}
                            className="text-[15px] font-medium text-gray-800"
                          >
                            {cat.name}
                          </Link>
                          {cat.subCategories && (
                            <div className="pl-4 flex flex-col gap-2 border-l border-gray-100 mb-2">
                              {cat.subCategories.map(sub => (
                                <Link
                                  key={sub.name}
                                  to={sub.path}
                                  onClick={toggleMobileMenu}
                                  className="text-[14px] text-gray-500 hover:text-[var(--color-primary)]"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
