import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Edit2, Image as ImageIcon, UploadCloud, X, AlertTriangle, CheckCircle2, LayoutTemplate, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';

const ManageServices = () => {
  const fileInputRef = useRef(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modal & Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ show: false, service: null });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await api.get('/services');
      setServices(data.data || []);
    } catch (error) {
      showToast('Failed to fetch services', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSlug('');
    setFile(null);
    setPreview(null);
    setIsEditing(false);
    setCurrentId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (service) => {
    setTitle(service.title);
    setDescription(service.description);
    setSlug(service.slug);
    setPreview(service.image_url);
    setIsEditing(true);
    setCurrentId(service.id);
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('slug', slug);
    if (file) {
      formData.append('image', file);
    }

    try {
      if (isEditing) {
        await api.put(`/admin/services/${currentId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Service updated successfully');
      } else {
        await api.post('/admin/services', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Service added successfully');
      }
      resetForm();
      fetchServices();
    } catch (error) {
      showToast(isEditing ? 'Failed to update service' : 'Failed to add service', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (service) => {
    setDeleteModal({ show: true, service });
  };

  const executeDelete = async () => {
    if (!deleteModal.service) return;
    setIsDeleting(true);
    
    try {
      await api.delete(`/admin/services/${deleteModal.service.id}`);
      showToast('Service deleted successfully');
      
      if (currentId === deleteModal.service.id) {
        resetForm();
      }
      
      fetchServices();
    } catch (error) {
      showToast('Failed to delete service', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ show: false, service: null });
    }
  };

  const isFormValid = title.trim() !== '' && description.trim() !== '' && slug.trim() !== '' && (preview !== null);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      
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

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Manage Services</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] font-medium">Add and manage the services offered on your platform.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Form Card */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[var(--color-border-subtle)] sticky top-6">
            <h2 className="text-xl font-extrabold text-[var(--color-text-primary)] mb-6">
              {isEditing ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="flex flex-col">
                <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5">
                  Service Title <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl border border-gray-200 bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent focus-within:bg-white transition-all duration-200">
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={e => {
                      setTitle(e.target.value);
                      if (!isEditing) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                    }}
                    placeholder="e.g. Property Valuation"
                    className="block w-full px-4 py-3 text-[14px] border-transparent bg-transparent outline-none text-[var(--color-text-primary)] placeholder-gray-400" 
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl border border-gray-200 bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent focus-within:bg-white transition-all duration-200 opacity-80">
                  <input 
                    type="text" 
                    required 
                    value={slug} 
                    onChange={e => setSlug(e.target.value)}
                    className="block w-full px-4 py-3 text-[14px] border-transparent bg-transparent outline-none text-[var(--color-text-secondary)] placeholder-gray-400" 
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5 flex justify-between">
                  <span>Description <span className="text-red-500">*</span></span>
                  <span className={`text-[11px] ${description.length > 250 ? 'text-red-500' : 'text-gray-400'}`}>{description.length}/250</span>
                </label>
                <div className="relative rounded-xl border border-gray-200 bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent focus-within:bg-white transition-all duration-200">
                  <textarea 
                    required 
                    rows="4"
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    className="block w-full px-4 py-3 text-[14px] border-transparent bg-transparent outline-none text-[var(--color-text-primary)] placeholder-gray-400 resize-none custom-scrollbar" 
                    placeholder="Short description of the service..."
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5">
                  Service Image <span className="text-red-500">*</span>
                </label>
                
                {!preview ? (
                  <div 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group"
                  >
                    <div className="bg-white w-12 h-12 rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-6 w-6 text-[var(--color-primary)]" />
                    </div>
                    <span className="text-[14px] font-bold text-[var(--color-text-primary)]">Click to upload</span>
                    <span className="text-[12px] text-[var(--color-text-secondary)] mt-1">or drag & drop</span>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                  </div>
                ) : (
                  <div className="mt-1 relative group w-full h-40 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                    <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={() => { setPreview(null); setFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} 
                        className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-6">
                <Button 
                  type="submit" 
                  disabled={!isFormValid || isSaving}
                  className="flex-1 w-full"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <><Plus className="mr-2 h-4 w-4 inline" /> {isEditing ? 'Update Service' : 'Save Service'}</>
                  )}
                </Button>
                
                {isEditing && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={resetForm}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Table Section */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-border-subtle)] overflow-hidden flex flex-col h-[700px]">
            <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
              <table className="w-full text-left border-collapse relative">
                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider w-24">Image</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Service Details</th>
                    <th className="px-6 py-4 text-right text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)]">
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-32 text-center">
                        <div className="flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
                          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5 border border-blue-100">
                            <LayoutTemplate className="h-10 w-10 text-blue-400" />
                          </div>
                          <h3 className="text-[18px] font-extrabold text-[var(--color-text-primary)] mb-2">No services found</h3>
                          <p className="text-[14px] max-w-sm mb-6">You haven't added any services yet. They will appear here once created.</p>
                          <div className="flex items-center text-[var(--color-primary)] font-bold text-sm bg-blue-50 px-4 py-2 rounded-full hidden xl:flex">
                            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                            Use the form on the left to add your first service
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    services.map(service => (
                      <tr key={service.id} className="hover:bg-blue-50/40 transition-colors group">
                        
                        <td className="px-6 py-4 whitespace-nowrap align-top">
                          {service.image_url ? (
                            <div className="h-16 w-16 bg-gray-50 border border-gray-200/60 rounded-xl shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-center overflow-hidden">
                              <img src={service.image_url} alt={service.title} className="h-full w-full object-cover" />
                            </div>
                          ) : (
                            <div className="h-16 w-16 bg-gray-50 border border-gray-200 border-dashed rounded-xl flex items-center justify-center text-gray-400">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 align-top">
                          <div className="text-[15px] font-extrabold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors mb-1">{service.title}</div>
                          <div className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed line-clamp-2 max-w-lg">{service.description}</div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right align-top">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => handleEdit(service)} 
                              className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => confirmDelete(service)} 
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
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.show && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => !isDeleting && setDeleteModal({ show: false, service: null })}
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
                  <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-2">Delete Service?</h3>
                  <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed px-4">
                    Are you sure you want to delete <span className="font-bold text-[var(--color-text-primary)]">"{deleteModal.service?.title}"</span>? 
                    This will permanently remove the service and its image.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 flex gap-4 mt-2 border-t border-[var(--color-border-subtle)]">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setDeleteModal({ show: false, service: null })}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 border-none"
                    onClick={executeDelete}
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
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
      `}} />
    </div>
  );
};

export default ManageServices;
