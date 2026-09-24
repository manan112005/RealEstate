import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import PropertyCard from '../../components/ui/PropertyCard';
import PropertyFilterBar from '../../components/property/PropertyFilterBar';
import Button from '../../components/ui/Button';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import { Filter, ChevronLeft, ChevronRight, AlertCircle, TrendingUp, DollarSign, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import preleasedHeroImg from '../../assets/pre-leased-hero.jpg';

const PreLeased = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const pageFromUrl = parseInt(searchParams.get('page')) || 1;
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  // Auto redirect to add listing_type=preleased if not present
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    if (currentParams.get('listing_type') !== 'preleased') {
      currentParams.set('listing_type', 'preleased');
      navigate(`/pre-leased?${currentParams.toString()}`, { replace: true });
    }
  }, [location.search, navigate]);

  const currentSort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const urlPage = parseInt(new URLSearchParams(location.search).get('page')) || 1;
    if (urlPage !== page) {
      setPage(urlPage);
    }
  }, [location.search]);

  useEffect(() => {
    if (searchParams.get('listing_type') === 'preleased') {
      fetchProperties();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.search, page]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(location.search);
      params.set('page', page);
      params.set('limit', limit);
      
      const { data } = await api.get(`/properties?${params.toString()}`);
      const items = data.data || [];
      const total = data.total !== undefined ? data.total : items.length;
      const pages = data.totalPages || Math.ceil(total / limit) || 1;

      if (items.length === 0 && page > 1) {
        goToPage(1);
        return;
      }

      setProperties(items);
      setTotalCount(total);
      setTotalPages(pages);
    } catch (error) {
      console.error('Error fetching properties', error);
      setError('Failed to fetch pre-leased properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (newPage) => {
    const validPage = Math.max(1, newPage);
    setPage(validPage);
    const params = new URLSearchParams(location.search);
    if (validPage === 1) {
      params.delete('page');
    } else {
      params.set('page', validPage);
    }
    navigate(`/pre-leased?${params.toString()}`);
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(location.search);
    if (e.target.value === 'newest') {
      params.delete('sort');
    } else {
      params.set('sort', e.target.value);
    }
    params.delete('page');
    setPage(1);
    navigate(`/pre-leased?${params.toString()}`);
  };

  const benefits = [
    { icon: DollarSign, title: "Immediate Cash Flow", desc: "Start earning rental income from day one without the hassle of finding a tenant." },
    { icon: TrendingUp, title: "High Rental Yields", desc: "Commercial pre-leased assets typically offer 7-10% ROI compared to 2-3% in residential." },
    { icon: Clock, title: "Zero Gestation Period", desc: "Skip the waiting period of under-construction projects. Your asset works for you instantly." },
    { icon: ShieldCheck, title: "Established Tenants", desc: "Properties are often leased to banks, MNCs, and strong retail brands ensuring secure lock-ins." }
  ];

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen pt-24 font-sans">
      <SEO title="Pre-Leased Properties for Sale | HomeSpace" description="Invest in premium pre-leased commercial and residential properties with guaranteed rental income." />
      
      {/* Hero Banner */}
      <section className="relative bg-black py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={preleasedHeroImg} 
            alt="Pre-Leased Commercial Properties" 
            className="w-full h-full object-cover object-center md:object-right brightness-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        </div>
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-500/25 border border-purple-400/50 text-purple-300 font-bold text-sm tracking-widest uppercase mb-6 backdrop-blur-md shadow-sm">
              <TrendingUp size={16} className="mr-2 text-purple-300" /> INVESTOR FOCUSED
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight drop-shadow-lg">
              Ready <span className="text-purple-300 drop-shadow-md">Income-Generating</span> Properties
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-10 max-w-2xl mx-auto md:mx-0 drop-shadow">
              Skip the tenant search. Invest in premium pre-leased real estate and secure immediate, steady ROI from day one with established corporate tenants.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white border-none shadow-xl" onClick={() => document.getElementById('preleased-listings').scrollIntoView({ behavior: 'smooth' })}>
                Explore Opportunities
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listings Section */}
      <section id="preleased-listings" className="py-20 bg-[var(--color-bg-secondary)] relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Sidebar Filters */}
          <div className="lg:w-[320px] shrink-0 hidden lg:block sticky top-32">
            <PropertyFilterBar />
          </div>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-[320px] max-w-[90vw] bg-white shadow-2xl overflow-y-auto lg:hidden"
              >
                <PropertyFilterBar onClose={() => setShowFilters(false)} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Backdrop for mobile filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
              />
            )}
          </AnimatePresence>

          {/* Grid Content */}
          <div className="flex-1 w-full min-w-0">
            
            {/* Top Bar: Results Count & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-[var(--color-border-subtle)]">
              <p className="text-[var(--color-text-secondary)] font-medium flex items-center">
                <TrendingUp size={18} className="mr-2 text-purple-600" />
                {!loading && !error && (
                  <>Showing <span className="text-[var(--color-text-primary)] font-bold mx-1">{properties.length}</span> income properties</>
                )}
              </p>
              
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <Button variant="secondary" onClick={() => setShowFilters(true)} className="lg:hidden shrink-0">
                  <Filter size={16} className="mr-2" /> Filters
                </Button>

                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="hidden md:inline text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide">
                    Sort:
                  </label>
                  <select 
                    id="sort"
                    value={currentSort}
                    onChange={handleSortChange}
                    className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[14px] font-semibold text-[var(--color-text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                  >
                    <option value="newest">Latest Listings</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error ? (
              <div className="bg-red-50 rounded-2xl p-8 border border-red-100 flex flex-col items-center justify-center text-center">
                <AlertCircle size={40} className="text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-600 mb-6">{error}</p>
                <Button onClick={() => fetchProperties()} variant="outline">Try Again</Button>
              </div>
            ) : loading ? (
              /* Loading State */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-xl shadow-soft h-[420px] animate-pulse border border-[var(--color-border-subtle)]">
                    <div className="h-56 bg-gray-200"></div>
                    <div className="p-5 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-2xl shadow-soft p-16 text-center border border-[var(--color-border-subtle)] flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp size={32} className="text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">No pre-leased properties found</h3>
                <p className="text-[var(--color-text-secondary)] text-lg max-w-md mx-auto mb-8">
                  Premium pre-leased assets get snagged quickly by investors. Please adjust your filters or contact us directly.
                </p>
                <Button onClick={() => navigate('/pre-leased?listing_type=preleased')} size="lg">Reset Filters</Button>
              </div>
            ) : (
              /* Results Grid */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                  {properties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16 flex justify-center">
                    <nav className="inline-flex rounded-xl shadow-sm bg-white border border-[var(--color-border-subtle)] overflow-hidden">
                      <button
                        onClick={() => goToPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-r border-[var(--color-border-subtle)]"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => goToPage(i + 1)}
                          className={`px-5 py-3 text-[15px] font-bold transition-colors border-r border-[var(--color-border-subtle)] last:border-r-0
                            ${page === i + 1 
                              ? 'bg-[var(--color-primary)] text-white' 
                              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-primary)]'}`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => goToPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Why Invest Section */}
      <section className="py-24 bg-white border-t border-[var(--color-border-subtle)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title="Why Invest in Pre-Leased Properties?" 
            subtitle="The smartest way to build a real estate portfolio with minimal risk and maximum returns."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {benefits.map((benefit, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card hover padding="p-8" className="h-full border-t-4 border-t-purple-500">
                  <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                    <benefit.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">{benefit.title}</h3>
                  <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed">{benefit.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-purple-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/connected.png')]"></div>
        <div className="max-w-[800px] mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Build Your Wealth Today</h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Our specialized commercial real estate team can help you identify high-yield pre-leased assets that align perfectly with your financial goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" variant="white" className="!text-purple-900 border-none shadow-xl">
                Consult an Expert <ArrowRight size={18} className="ml-2 inline" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PreLeased;