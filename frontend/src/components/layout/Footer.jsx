import { Link } from 'react-router-dom';
import { Phone, Mail, ArrowRight, Home } from 'lucide-react';
import { FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-text-primary)] text-white pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & About */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/15 shrink-0">
                <Home size={20} className="text-[var(--color-secondary)]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white flex items-center">
                <span className="text-white uppercase font-black">REAL</span>
                <span className="text-[var(--color-secondary)] uppercase ml-1.5 font-bold tracking-wider text-2xl">ESTATE</span>
              </span>
            </Link>
            <p className="text-[var(--color-text-muted)] text-[15px] leading-relaxed mb-6 pr-4">
              Your trusted partner in finding the perfect property. Premium real estate solutions across Gujarat.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Explore</h4>
            <ul className="space-y-4">
              {['Properties', 'Services', 'Bank Auction', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-[var(--color-text-muted)] text-[15px] hover:text-white transition-colors flex items-center group font-medium"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[var(--color-secondary)]" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Property Categories</h4>
            <ul className="space-y-4">
              {['Residential', 'Commercial', 'Pre Leased', 'Bank Auction', 'Land', 'Farm House', 'Plots', 'Investments', 'Loan'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Bank Auction' ? '/bank-auction' : item === 'Pre Leased' ? '/pre-leased' : `/properties?category=${item}`} 
                    className="text-[var(--color-text-muted)] text-[15px] hover:text-white transition-colors flex items-center group font-medium"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[var(--color-secondary)]" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact</h4>
            <div className="space-y-4">
              <a href="tel:+919876543210" className="flex items-start gap-4 text-[var(--color-text-muted)] hover:text-white transition-colors group">
                <div className="mt-1 p-2 bg-white/5 rounded-full group-hover:bg-[var(--color-primary)] transition-colors shrink-0">
                  <Phone size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-medium">+91 98765 43210</p>
                  <p className="text-[15px] font-medium">+91 91234 56789</p>
                </div>
              </a>
              <a href="mailto:realestate2162@gmail.com" className="flex items-center gap-4 text-[var(--color-text-muted)] hover:text-white transition-colors group">
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-[var(--color-primary)] transition-colors shrink-0">
                  <Mail size={18} className="text-white" />
                </div>
                <span className="text-[15px] font-medium break-all">realestate2162@gmail.com</span>
              </a>
              
              <div className="pt-4 flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-[var(--color-primary)] transition-colors" aria-label="Facebook">
                  <FiFacebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-[var(--color-primary)] transition-colors" aria-label="Instagram">
                  <FiInstagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white hover:bg-[var(--color-primary)] transition-colors" aria-label="LinkedIn">
                  <FiLinkedin size={18} />
                </a>
              </div>
            </div>
          </div>
          
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-[var(--color-text-muted)] font-medium">
            &copy; {new Date().getFullYear()} KESAR REAL ESTATE. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-[var(--color-text-muted)] font-medium">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
