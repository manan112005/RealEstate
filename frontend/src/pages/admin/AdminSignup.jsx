import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, Loader2, Home, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import authBg from '../../assets/auth-bg.jpg';

const AdminSignup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Simple password strength calculation
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
    if (pass.length > 5) score += 1;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score === 3 || score === 4) return { score, label: 'Good', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setLoading(true);
    try {
      await signup({ 
        name: formData.name, 
        email: formData.email, 
        phone: formData.phone, 
        password: formData.password 
      });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
        {/* Gradient Overlay for optimal readability */}
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
            Partner Portal
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-5 drop-shadow-lg">
            Join the inner circle.
          </h1>
          <p className="text-lg text-white/90 leading-relaxed drop-shadow mb-8">
            Create your admin account to manage premium listings, connect with top-tier bank partners, and orchestrate the ultimate real estate experience.
          </p>
          
          <div className="space-y-3.5 bg-black/20 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center text-white/95">
              <CheckCircle2 size={18} className="text-[var(--color-secondary)] mr-3 shrink-0" />
              <span className="text-sm font-medium">Full control over property listings</span>
            </div>
            <div className="flex items-center text-white/95">
              <CheckCircle2 size={18} className="text-[var(--color-secondary)] mr-3 shrink-0" />
              <span className="text-sm font-medium">Direct integration with bank partners</span>
            </div>
            <div className="flex items-center text-white/95">
              <CheckCircle2 size={18} className="text-[var(--color-secondary)] mr-3 shrink-0" />
              <span className="text-sm font-medium">Real-time client inquiry management</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="relative z-10 text-sm text-white/70 font-medium flex items-center justify-between border-t border-white/15 pt-6">
          <span>&copy; {new Date().getFullYear()} HomeSpace. All rights reserved.</span>
          <span className="text-xs bg-black/30 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10 text-white/80">Luxury Portfolio</span>
        </div>
      </div>

      {/* Right Panel: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white overflow-y-auto">
        
        {/* Mobile Logo (Visible only on mobile) */}
        <div className="absolute top-8 left-6 sm:left-12 lg:hidden flex items-center gap-2 z-10">
          <Home size={28} className="text-[var(--color-primary)]" />
          <span className="text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            Home<span className="text-[var(--color-primary)]">Space</span>
          </span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px] mt-16 lg:mt-0"
        >
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-3">Create Account</h2>
            <p className="text-[var(--color-text-secondary)]">Sign up to get access to the admin dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start border border-red-100 mb-4">
                <AlertCircle size={20} className="mr-3 shrink-0 mt-0.5" />
                <span className="text-[14px] font-medium">{error}</span>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[var(--color-text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent focus:bg-white transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[var(--color-text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent focus:bg-white transition-all"
                  placeholder="admin@homespace.com"
                />
              </div>
            </div>
            
            {/* Phone Field */}
            <div>
              <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[var(--color-text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent focus:bg-white transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-gray-100">
                    <div className={`h-full transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} style={{ width: '20%' }}></div>
                    <div className={`h-full transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} style={{ width: '20%' }}></div>
                    <div className={`h-full transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} style={{ width: '20%' }}></div>
                    <div className={`h-full transition-all duration-300 ${strength.score >= 4 ? strength.color : 'bg-transparent'}`} style={{ width: '20%' }}></div>
                    <div className={`h-full transition-all duration-300 ${strength.score >= 5 ? strength.color : 'bg-transparent'}`} style={{ width: '20%' }}></div>
                  </div>
                  <p className={`text-[12px] font-medium mt-1 ${
                    strength.score <= 2 ? 'text-red-500' : strength.score <= 4 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {strength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[var(--color-text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent focus:bg-white transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[var(--color-primary)] transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 text-[16px] shadow-md hover:shadow-lg transition-shadow"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin inline" /> Creating Account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </div>
            
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center pb-8 lg:pb-0">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Already have an account?{' '}
              <Link to="/admin/login" className="font-bold text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors">
                Log in
              </Link>
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default AdminSignup;