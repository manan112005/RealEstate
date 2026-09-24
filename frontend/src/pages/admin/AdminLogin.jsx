import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import authBg from '../../assets/auth-bg.jpg';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure user is logged out when visiting login page
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      
      {/* Left Panel: Branding with Custom Villa Background (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative text-white overflow-hidden flex-col justify-between p-12 bg-slate-900">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-100"
          style={{ backgroundImage: `url(${authBg})` }}
        />
        {/* Gradient Overlay for Optimal Text Readability while preserving image aesthetics */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-950/70 backdrop-blur-[0.5px]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-secondary)]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
            <Home size={26} className="text-[var(--color-secondary)]" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight drop-shadow-md">
            Home<span className="text-[var(--color-secondary)]">Space</span>
          </span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-md">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase mb-4 text-[var(--color-secondary)]">
            Admin Portal
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-5 drop-shadow-lg">
            Manage your real estate empire.
          </h1>
          <p className="text-lg text-white/90 leading-relaxed drop-shadow">
            Access your dashboard to manage listings, connect with bank partners, and monitor client inquiries all in one unified platform.
          </p>
        </div>

        {/* Bottom Credits */}
        <div className="relative z-10 text-sm text-white/70 font-medium flex items-center justify-between border-t border-white/15 pt-6">
          <span>&copy; {new Date().getFullYear()} HomeSpace. All rights reserved.</span>
          <span className="text-xs bg-black/30 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10 text-white/80">Luxury Portfolio</span>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
        
        {/* Mobile Logo (Visible only on mobile) */}
        <div className="absolute top-8 left-6 sm:left-12 lg:hidden flex items-center gap-2">
          <Home size={28} className="text-[var(--color-primary)]" />
          <span className="text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            Home<span className="text-[var(--color-primary)]">Space</span>
          </span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-3">Welcome back</h2>
            <p className="text-[var(--color-text-secondary)]">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start border border-red-100">
                <AlertCircle size={20} className="mr-3 shrink-0 mt-0.5" />
                <span className="text-[14px] font-medium">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[var(--color-text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent focus:bg-white transition-all"
                  placeholder="admin@homespace.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[var(--color-text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent focus:bg-white transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[var(--color-primary)] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Utility Links */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--color-text-secondary)] cursor-pointer">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 text-[16px] shadow-md hover:shadow-lg transition-shadow"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin inline" /> Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </div>
            
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Don't have an account?{' '}
              <Link to="/admin/signup" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors">
                Sign up
              </Link>
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;