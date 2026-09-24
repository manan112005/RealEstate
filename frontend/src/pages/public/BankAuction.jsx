import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import PropertyCard from '../../components/ui/PropertyCard';
import PropertyFilterBar from '../../components/property/PropertyFilterBar';
import Button from '../../components/ui/Button';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import { Filter, ChevronLeft, ChevronRight, ChevronDown, AlertCircle, ArrowDownUp, CheckCircle2, Map, Gavel, FileCheck, HelpCircle, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import auctionHeroImg from '../../assets/bank-auction-hero.jpg';

const BankAuction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  
  const searchParams = new URLSearchParams(location.search);
  const pageFromUrl = parseInt(searchParams.get('page')) || 1;
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  // Sync URL params to ensure listing_type=auction is present, otherwise add it.
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    if (currentParams.get('listing_type') !== 'auction') {
      currentParams.set('listing_type', 'auction');
      navigate(`/bank-auction?${currentParams.toString()}`, { replace: true });
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
    if (searchParams.get('listing_type') === 'auction') {
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
      setError('Failed to fetch auction properties. Please try again later.');
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
    navigate(`/bank-auction?${params.toString()}`);
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
    navigate(`/bank-auction?${params.toString()}`);
  };

  const steps = [
    { icon: CheckCircle2, title: "1. Registration", desc: "Sign up and verify your KYC documents with our auction specialists." },
    { icon: Map, title: "2. Site Visit", desc: "Schedule a physical inspection of the property before making any commitments." },
    { icon: Gavel, title: "3. Bidding", desc: "Participate in the official e-auction process with our guided support." },
    { icon: FileCheck, title: "4. Documentation", desc: "Complete the legal paperwork and transfer of ownership seamlessly." }
  ];

  const faqs = [
    { q: "Are bank auction properties legally safe?", a: "Yes. These properties are auctioned under the SARFAESI Act, ensuring a clean title transfer directly from the bank to the buyer, completely wiping out previous owner encumbrances." },
    { q: "Can I get a home loan for an auctioned property?", a: "Absolutely. Many of our partner banks offer financing for these properties, though the initial EMD (Earnest Money Deposit) must usually be paid out of pocket." },
    { q: "Why are they priced below market value?", a: "Banks are primarily interested in recovering their outstanding loan amounts quickly rather than waiting for peak market prices, passing the discount on to the buyer." },
    { q: "What happens if there are outstanding maintenance dues?", a: "We conduct thorough due diligence prior to the auction to identify any outstanding society or municipal dues so you are fully informed before bidding." }
  ];

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen pt-24 font-sans">
      <SEO title="Bank Auction Properties | HomeSpace" description="Discover premium bank-seized properties at unmatched prices across Gujarat." />
      
      {/* Hero Banner */}
      <section className="relative bg-black py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={auctionHeroImg} 
            alt="Bank Auction Properties" 
            className="w-full h-full object-cover object-center md:object-right brightness-105 contrast-105" 
          />
          {/* Natural soft gradient: smooth dark tone on left for typography, transparent on right to reveal the gavel & house */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        </div>
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold text-sm tracking-wide mb-6 backdrop-blur-md shadow-sm">
              <Gavel size={16} className="mr-2 text-amber-300" /> EXCLUSIVE AUCTIONS
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
              Secure Premium Properties <span className="text-[#f5c242] drop-shadow-md">Below Market Value</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-10 max-w-xl drop-shadow">
              We partner directly with leading banks to bring you verified, legally clear, seized properties at unprecedented discounts.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="shadow-xl" onClick={() => document.getElementById('auction-listings').scrollIntoView({ behavior: 'smooth' })}>
                View Active Auctions
              </Button>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-white border-white/80 bg-black/30 backdrop-blur-sm hover:bg-white hover:text-gray-900">
                  Speak to an Expert
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listings Section */}
      <section id="auction-listings" className="py-20 bg-[var(--color-bg-secondary)] relative">
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
                <Gavel size={18} className="mr-2 text-orange-500" />
                {!loading && !error && (
                  <>Showing <span className="text-[var(--color-text-primary)] font-bold mx-1">{totalCount}</span> live {totalCount === 1 ? 'auction' : 'auctions'}</>
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
                    <option value="newest">Latest Auctions</option>
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
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                  <Gavel size={32} className="text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">No active auctions match your criteria</h3>
                <p className="text-[var(--color-text-secondary)] text-lg max-w-md mx-auto mb-8">
                  Bank auctions are highly competitive and inventory moves fast. Adjust your filters or check back soon.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {page > 1 && (
                    <Button onClick={() => goToPage(1)} variant="secondary" size="lg">
                      Back to First Page
                    </Button>
                  )}
                  <Button onClick={() => navigate('/bank-auction?listing_type=auction')} size="lg">Reset Filters</Button>
                </div>
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

      {/* How It Works Section */}
      <section className="py-24 bg-white border-t border-[var(--color-border-subtle)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title="How Bank Auctions Work" 
            subtitle="We demystify the bank auction process, providing end-to-end guidance from discovery to ownership."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative"
              >
                {/* Connecting Line */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-orange-200 to-transparent z-0" />
                )}
                
                <Card hover padding="p-8" className="h-full relative z-10 text-center border-t-4 border-t-orange-500">
                  <div className="w-20 h-20 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-6">
                    <step.icon size={36} className="text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">{step.title}</h3>
                  <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-subtle)]">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <HelpCircle size={48} className="mx-auto text-[var(--color-primary)] mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)]">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} padding="p-0" className="overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-[var(--color-text-primary)] pr-8">{faq.q}</span>
                  <ChevronDown size={20} className={`text-[var(--color-text-secondary)] transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-[15px] text-[var(--color-text-secondary)] leading-relaxed border-t border-gray-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-[var(--color-primary)] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-[800px] mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Need Help Bidding?</h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
            Our specialized auction team is ready to guide you through the complexities of bank auctions, ensuring you secure the best deal safely.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" className="bg-[var(--color-secondary)] hover:bg-[#b5952f] text-white border-none shadow-xl">
                Contact Auction Team
              </Button>
            </Link>
            <a href="tel:+919000000000">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <PhoneCall size={18} className="mr-2" /> Call Now
              </Button>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BankAuction;