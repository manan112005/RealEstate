import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, ArrowRight, X, HeadphonesIcon, Settings } from 'lucide-react';
import servicesHeroImg from '../../assets/services-hero.jpg';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data.data || []);
      } catch (err) {
        console.error('Error fetching services', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedService]);

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen pt-24 font-sans relative">
      <SEO title="Our Premium Services | Real Estate" description="Comprehensive real estate solutions designed to maximize your value and minimize your stress." />
      
      {/* Hero Section */}
      <section className="relative bg-slate-950 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={servicesHeroImg} 
            alt="Real Estate Services" 
            className="w-full h-full object-cover object-center md:object-right brightness-105 contrast-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/25 md:to-transparent" />
        </div>
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/25 border border-blue-400/50 text-blue-300 font-bold text-sm tracking-widest uppercase mb-6 backdrop-blur-md shadow-sm">
              <Briefcase size={16} className="mr-2 text-blue-300" /> Expert Solutions
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight drop-shadow-lg">
              Our <span className="text-[#60a5fa] drop-shadow-md">Premium</span> Services
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl drop-shadow">
              Comprehensive real estate and financial solutions designed to maximize your asset value and minimize your stress.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-24 bg-[var(--color-bg-secondary)] relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-[24px] shadow-soft h-[500px] animate-pulse border border-[var(--color-border-subtle)] flex flex-col">
                  <div className="h-56 bg-gray-200 rounded-t-[24px]"></div>
                  <div className="p-8 space-y-4 flex-1">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-2xl p-10 border border-red-100 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
              <Settings size={48} className="text-red-500 mb-6" />
              <h3 className="text-2xl font-bold text-red-800 mb-3">Oops! Something went wrong</h3>
              <p className="text-red-600 mb-8 text-lg">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white rounded-[32px] shadow-soft p-16 text-center border border-[var(--color-border-subtle)] max-w-4xl mx-auto flex flex-col items-center">
              <div className="w-24 h-24 bg-[var(--color-bg-secondary)] rounded-full flex items-center justify-center mb-8">
                <Briefcase size={40} className="text-gray-400" />
              </div>
              <h3 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-4">Services Coming Soon</h3>
              <p className="text-[var(--color-text-secondary)] text-lg max-w-lg mx-auto leading-relaxed">
                We are currently updating our digital service catalog to serve you better. Please contact our team directly for immediate assistance.
              </p>
              <Link to="/contact" className="mt-10">
                <Button size="lg">Contact Us Directly</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {services.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (idx % 3) * 0.15 }}
                >
                  <Card hover padding="p-0" className="h-full flex flex-col bg-white overflow-hidden group">
                    <div className="h-60 overflow-hidden relative bg-gray-100">
                      <img 
                        src={service.image_url || 'https://placehold.co/800x600/ececec/999999?text=Service'} 
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">{service.title}</h3>
                      
                      {/* Extract plain text from HTML description for the card preview */}
                      <div className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed line-clamp-4 flex-1 mb-8"
                           dangerouslySetInnerHTML={{ __html: service.description }}
                      />
                      
                      <div className="mt-auto pt-4 border-t border-[var(--color-border-subtle)]">
                        <button 
                          onClick={() => setSelectedService(service)}
                          className="flex items-center text-[var(--color-primary)] font-bold uppercase tracking-wider text-sm group/btn hover:text-[var(--color-secondary)] transition-colors"
                        >
                          Learn More 
                          <ArrowRight size={16} className="ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-[var(--color-primary)] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-[800px] mx-auto px-4 relative z-10">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <HeadphonesIcon size={36} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Need a Custom Solution?</h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Don't see exactly what you're looking for? Our team of real estate experts can tailor a service package specifically for your unique requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" variant="white" className="border-none shadow-xl px-10">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Modal Image Header */}
              <div className="h-48 sm:h-64 shrink-0 relative bg-gray-100">
                <img 
                  src={selectedService.image_url || 'https://placehold.co/800x600/ececec/999999?text=Service'} 
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 pr-8">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                    {selectedService.title}
                  </h2>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-10 overflow-y-auto">
                <div className="prose prose-lg text-[var(--color-text-secondary)] max-w-none prose-headings:text-[var(--color-text-primary)] prose-a:text-[var(--color-primary)]">
                  <div dangerouslySetInnerHTML={{ __html: selectedService.description }} />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 sm:p-8 border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-[14px] font-medium text-[var(--color-text-secondary)] text-center sm:text-left">
                  Interested in this service? Let's discuss your requirements.
                </p>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button variant="outline" onClick={() => setSelectedService(null)} className="flex-1 sm:flex-none">
                    Close
                  </Button>
                  <Link to="/contact" className="flex-1 sm:flex-none" onClick={() => setSelectedService(null)}>
                    <Button className="w-full">Enquire Now</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Services;
