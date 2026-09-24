import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Edit2, Trash2, Plus, Search, Home, AlertTriangle, X, ChevronLeft, ChevronRight, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal & Toast states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const fetchProperties = async () => {
    try {
      const { data } = await api.get('/admin/properties');
      setProperties(data.data || []);
    } catch (error) {
      console.error('Error fetching properties', error);
      showToast('Failed to fetch properties', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Derive unique categories and cities for dropdowns
  const uniqueCategories = useMemo(() => {
    const categories = properties.map(p => p.PropertyType?.name).filter(Boolean);
    return [...new Set(categories)].sort();
  }, [properties]);

  const uniqueCities = useMemo(() => {
    const cities = properties.map(p => p.City?.name).filter(Boolean);
    return [...new Set(cities)].sort();
  }, [properties]);

  // Apply filters
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (p.City?.name && p.City.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter ? p.PropertyType?.name === categoryFilter : true;
      const matchesCity = cityFilter ? p.City?.name === cityFilter : true;
      
      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [properties, searchTerm, categoryFilter, cityFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProperties, currentPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, cityFilter]);

  const confirmDelete = (property) => {
    setPropertyToDelete(property);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;
    
    setIsDeleting(true);
    try {
      // Optimistic update
      const idToDelete = propertyToDelete.id;
      setProperties(prev => prev.filter(p => p.id !== idToDelete));
      
      await api.delete(`/admin/properties/${idToDelete}`);
      showToast('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      showToast('Failed to delete property', 'error');
      // Revert optimistic update by refetching
      fetchProperties();
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setPropertyToDelete(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setCityFilter('');
  };

  const getStatusColor = (status) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'active') return 'bg-green-100 text-green-800 border-green-200';
    if (normalized === 'sold' || normalized === 'rented') return 'bg-gray-100 text-gray-800 border-gray-200';
    if (normalized === 'inactive') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-12 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-white font-bold ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Manage Properties</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)] font-medium">View, edit, or remove property listings from your platform.</p>
        </div>
        
        <Link to="/admin/properties/add" className="shrink-0">
          <Button size="lg" className="shadow-md hover:shadow-xl w-full xl:w-auto">
            <Plus className="mr-2 h-5 w-5 inline" /> Add Property
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-[var(--color-border-subtle)] mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title or city..."
            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl leading-5 text-[var(--color-text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-1 gap-4 w-full">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl leading-5 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Home className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="block w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl leading-5 text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-sm border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left border-collapse relative">
            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">City</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {paginatedProperties.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-bold text-[var(--color-text-primary)] mb-1">No properties found</p>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                        {properties.length === 0 ? "You haven't added any properties yet." : "Try adjusting your filters or search term."}
                      </p>
                      {properties.length === 0 ? (
                        <Link to="/admin/properties/add"><Button>Add Property</Button></Link>
                      ) : (
                        <Button variant="outline" onClick={clearFilters}>Clear All Filters</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProperties.map((property) => (
                  <tr key={property.id} className="even:bg-gray-50/50 hover:bg-blue-50/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-16 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-[var(--color-border-subtle)] mr-4">
                          {(property.PropertyImages?.[0]?.cloudinary_url || property.images?.[0]?.cloudinary_url) ? (
                            <img 
                              src={property.PropertyImages?.[0]?.cloudinary_url || property.images?.[0]?.cloudinary_url} 
                              alt="" 
                              className="h-full w-full object-cover" 
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center"><Home size={16} className="text-gray-400" /></div>
                          )}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{property.title}</div>
                          <div className="text-[12px] font-medium text-[var(--color-text-secondary)] mt-0.5 max-w-[200px] truncate">
                            {property.address_line_1 || property.Area?.name || [property.City?.name, property.State?.name].filter(Boolean).join(', ') || 'No address'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[14px] font-semibold text-[var(--color-text-secondary)]">
                      {property.PropertyType?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[14px] font-semibold text-[var(--color-text-secondary)]">
                      {property.City?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[14px] font-extrabold text-[var(--color-text-primary)]">
                      ₹{Number(property.price).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-[11px] font-bold rounded-full border uppercase tracking-wider ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link 
                          to={`/admin/properties/edit/${property.id}`} 
                          className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm" 
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => confirmDelete(property)} 
                          className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100 hover:border-transparent"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[var(--color-border-subtle)] bg-white flex items-center justify-between">
            <div className="text-[13px] font-medium text-[var(--color-text-secondary)]">
              Showing <span className="font-bold text-[var(--color-text-primary)]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-[var(--color-text-primary)]">{Math.min(currentPage * itemsPerPage, filteredProperties.length)}</span> of <span className="font-bold text-[var(--color-text-primary)]">{filteredProperties.length}</span> results
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[var(--color-border-subtle)] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--color-text-primary)]"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-[var(--color-border-subtle)] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--color-text-primary)]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => !isDeleting && setDeleteModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto flex flex-col">
                <div className="p-6 text-center pt-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={32} className="text-red-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-2">Delete Property?</h3>
                  <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed px-4">
                    Are you sure you want to delete <span className="font-bold text-[var(--color-text-primary)]">"{propertyToDelete?.title}"</span>? This action will permanently remove the listing and all associated images from the servers.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 flex gap-4 mt-2 border-t border-[var(--color-border-subtle)]">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setDeleteModalOpen(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 border-none"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ManageProperties;