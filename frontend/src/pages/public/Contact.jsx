import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { MapPin, Phone, Mail, Clock, CheckCircle2, AlertCircle, PhoneCall, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import contactHeroImg from '../../assets/contact-hero.jpg';

const Contact = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const propName = params.get('property');
    if (propName) {
      setFormData(prev => ({ ...prev, message: `I am interested in the property: ${propName}` }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Contact submission error:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen pt-24 font-sans overflow-x-hidden">
      <SEO title="Contact Us | Real Estate" description="Get in touch with us for premium real estate inquiries, bank auctions, and financial services." />
      
      {/* Hero Section */}
      <section className="relative bg-slate-950 py-24 lg:py-32 overflow-hidden text-white">
        <div className="absolute inset-0">
          <img 
            src={contactHeroImg} 
            alt="Contact Us - City Skyline" 
            className="w-full h-full object-cover object-center md:object-right brightness-105 contrast-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        </div>
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold text-sm tracking-widest uppercase mb-6 backdrop-blur-md shadow-sm">
              Contact Us
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight drop-shadow-lg">
              Get in <span className="text-[#f5c242] drop-shadow-md">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl drop-shadow">
              Let's build a better tomorrow together. Real people, real solutions for all your property and investment needs.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20 bg-[var(--color-bg-secondary)] relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-[var(--color-border-subtle)] flex flex-col lg:flex-row">
            
            {/* Left Column: Contact Info & Map */}
            <div className="lg:w-2/5 bg-[var(--color-primary)] text-white p-10 lg:p-14 relative overflow-hidden flex flex-col justify-between">
              {/* Decorative Background */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-8">Contact Information</h3>
                <p className="text-white/80 mb-10 leading-relaxed text-[15px]">
                  Fill out the form and our team will get back to you within 24 hours. For immediate assistance, please call us.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-[var(--color-secondary)]" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-white mb-1">Office Address</h4>
                      <p className="text-white/80 text-[15px] leading-relaxed">
                        Suite 404, Pinnacle Business Hub,<br />
                        S.G. Highway, Bodakdev,<br />
                        Ahmedabad, Gujarat - 380054
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                      <Phone size={20} className="text-[var(--color-secondary)]" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-white mb-1">Phone</h4>
                      <p className="text-white/80 text-[15px]">+91 98765 43210</p>
                      <p className="text-white/80 text-[15px]">+91 91234 56789</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                      <Mail size={20} className="text-[var(--color-secondary)]" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-white mb-1">Email</h4>
                      <p className="text-white/80 text-[15px]">realestate2162@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                      <Clock size={20} className="text-[var(--color-secondary)]" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-white mb-1">Business Hours</h4>
                      <p className="text-white/80 text-[15px]">Mon - Sat: 10:00 AM - 7:00 PM</p>
                      <p className="text-white/80 text-[15px]">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="mt-12 relative z-10 rounded-2xl overflow-hidden shadow-lg h-56 w-full border-2 border-white/10">
                <iframe 
                  title="Google Maps Location"
                  src="https://maps.google.com/maps?q=S.G.%20Highway,%20Bodakdev,%20Ahmedabad,%20Gujarat&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:w-3/5 p-10 lg:p-14 bg-white relative">
              
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={48} className="text-green-500" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-4">Message Sent!</h3>
                    <p className="text-[var(--color-text-secondary)] text-lg max-w-md mx-auto mb-8">
                      Thank you for reaching out to HomeSpace. A member of our team will review your inquiry and contact you shortly.
                    </p>
                    <Button onClick={() => setSuccess(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8">Send us a message</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                      {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start border border-red-100">
                          <AlertCircle size={20} className="mr-3 shrink-0 mt-0.5" />
                          <span className="text-[14px] font-medium">{error}</span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                            Full Name *
                          </label>
                          <input 
                            type="text" 
                            name="name" 
                            required 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3.5 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all" 
                            placeholder="John Doe" 
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                            Phone Number *
                          </label>
                          <input 
                            type="tel" 
                            name="phone" 
                            required 
                            value={formData.phone} 
                            onChange={handleChange} 
                            className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3.5 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all" 
                            placeholder="+91 98765 43210" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                          Email Address *
                        </label>
                        <input 
                          type="email" 
                          name="email" 
                          required 
                          value={formData.email} 
                          onChange={handleChange} 
                          className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3.5 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all" 
                          placeholder="john@example.com" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                          Your Message *
                        </label>
                        <textarea 
                          name="message" 
                          rows="5" 
                          required 
                          value={formData.message} 
                          onChange={handleChange} 
                          className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl px-4 py-3.5 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-y" 
                          placeholder="How can we help you?"
                        ></textarea>
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          type="submit" 
                          disabled={loading} 
                          size="lg"
                          className="w-full py-4 text-lg shadow-lg hover:shadow-xl transition-shadow"
                        >
                          {loading ? (
                            <>
                              <Loader2 size={20} className="mr-2 animate-spin inline" /> Sending Message...
                            </>
                          ) : (
                            <>
                              Send Message <Send size={18} className="ml-2 inline" />
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <p className="text-center text-[13px] text-[var(--color-text-secondary)] mt-4">
                        By submitting this form, you agree to our privacy policy and terms of service.
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-12 bg-white border-t border-[var(--color-border-subtle)] text-center">
        <div className="max-w-[800px] mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <PhoneCall size={24} className="text-[var(--color-primary)]" />
            </div>
            <div className="text-left">
              <p className="text-[14px] text-[var(--color-text-secondary)] font-medium">Prefer to talk directly?</p>
              <p className="text-xl font-bold text-[var(--color-text-primary)]">+91 98765 43210</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-gray-200"></div>
          <a href="tel:+919876543210">
            <Button variant="outline">Call Us Now</Button>
          </a>
        </div>
      </section>

    </div>
  );
};

export default Contact;
