import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import PropertyCard from '../../components/ui/PropertyCard';
import PropertyFilterBar from '../../components/property/PropertyFilterBar';
import Button from '../../components/ui/Button';
import { Filter, ChevronLeft, ChevronRight, AlertCircle, ArrowDownUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Properties = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [properties, setProperties] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Derive page and sort from URL
  const searchParams = new URLSearchParams(location.search);
  const pageFromUrl = parseInt(searchParams.get('page')) || 1;
  const [page, setPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  const currentSort = searchParams.get('sort') || 'newest';

  // Sync page state when URL changes
  useEffect(() => {
    const urlPage = parseInt(new URLSearchParams(location.search).get('page')) || 1;
    if (urlPage !== page) {
      setPage(urlPage);
    }
  }, [location.search]);

  useEffect(() => {
    fetchProperties();
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

      // If page is beyond available results and page > 1, auto-recover to page 1
      if (items.length === 0 && page > 1) {
        goToPage(1);
        return;
      }

      setProperties(items);
      setTotalCount(total);
      setTotalPages(pages);
    } catch (error) {
      console.error('Error fetching properties', error);
      setError('Failed to fetch properties. Please try again later.');
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
    navigate(`/properties?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setPage(1);
    navigate('/properties');
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(location.search);
    if (e.target.value === 'newest') {
      params.delete('sort');
    } else {
      params.set('sort', e.target.value);
    }
    params.delete('page'); // Reset to first page on sort
    setPage(1);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-[var(--color-bg-secondary)] min-h-screen pt-24 pb-24">
      <SEO title="Luxury Properties Collection | HomeSpace" description="Browse our extensive catalog of premium real estate properties in Gujarat." />
      
      {/* Header Area */}
      <div className="bg-white border-b border-[var(--color-border-subtle)] shadow-sm sticky top-24 z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] leading-tight tracking-tight">Explore Properties</h1>
            <p className="text-[var(--color-text-secondary)] text-[15px] mt-1 font-medium">Find your next dream investment across Gujarat</p>
          </div>
          <Button 
            variant="secondary"
            onClick={() => setShowFilters(true)}
            className="md:hidden"
          >
            <Filter size={18} className="mr-2" /> Filters
          </Button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Sidebar Filters */}
        <div className="lg:w-[320px] shrink-0 hidden lg:block sticky top-52">
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

        {/* Main Content */}
        <div className="flex-1 w-full min-w-0">
          
          {/* Top Bar: Results Count & Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <p className="text-[var(--color-text-secondary)] font-medium">
              {!loading && !error && (
                <>Showing <span className="text-[var(--color-text-primary)] font-bold">{totalCount}</span> {totalCount === 1 ? 'property' : 'properties'}</>
              )}
            </p>
            
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-wide shrink-0">
                <ArrowDownUp size={14} className="inline mr-1" /> Sort By:
              </label>
              <select 
                id="sort"
                value={currentSort}
                onChange={handleSortChange}
                className="bg-white border border-[var(--color-border-subtle)] text-[14px] font-semibold text-[var(--color-text-primary)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
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
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Filter size={32} className="text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">No properties match your filters</h3>
              <p className="text-[var(--color-text-secondary)] text-lg max-w-md mx-auto mb-8">
                Try adjusting your search criteria, removing some filters, or exploring a different location.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {page > 1 && (
                  <Button onClick={() => goToPage(1)} variant="secondary" size="lg">
                    Back to First Page
                  </Button>
                )}
                <Button onClick={clearAllFilters} size="lg">Clear All Filters</Button>
              </div>
            </div>
          ) : (
            /* Results Grid */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {properties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (index % 9) * 0.05 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination - only shown when more than 1 page exists */}
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
    </div>
  );
};

export default Properties;
