import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Edit2, Image as ImageIcon, UploadCloud, X, AlertTriangle, CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';

const ManagePartners = () => {
  const fileInputRef = useRef(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modal & Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ show: false, partner: null });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data } = await api.get('/partners');
      // Sort immediately by display_order ascending
      const sortedPartners = (data.data || []).sort((a, b) => a.display_order - b.display_order);
      setPartners(sortedPartners);
    } catch (error) {
      showToast('Failed to fetch partners', 'error');
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
    setName('');
    setDisplayOrder(0);
    setFile(null);
    setPreview(null);
    setIsEditing(false);
    setCurrentId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (partner) => {
    setName(partner.name);
    setDisplayOrder(partner.display_order);
    setPreview(partner.logo_cloudinary_url);
    setIsEditing(true);
    setCurrentId(partner.id);
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('display_order', displayOrder);
    if (file) {
      formData.append('logo', file);
    }

    try {
      if (isEditing) {
        await api.put(`/admin/partners/${currentId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Partner updated successfully');
      } else {
        await api.post('/admin/partners', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Partner added successfully');
      }
      resetForm();
      fetchPartners();
    } catch (error) {
      showToast(isEditing ? 'Failed to update partner' : 'Failed to add partner', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (partner) => {
    setDeleteModal({ show: true, partner });
  };

  const executeDelete = async () => {
    if (!deleteModal.partner) return;
    setIsDeleting(true);
    
    try {
      await api.delete(`/admin/partners/${deleteModal.partner.id}`);
      showToast('Partner deleted successfully');
      
      // If we were editing this partner, reset the form
      if (currentId === deleteModal.partner.id) {
        resetForm();
      }
      
      fetchPartners();
    } catch (error) {
      showToast('Failed to delete partner', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ show: false, partner: null });
    }
  };

  // Reorder functionality
  const handleReorder = async (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === partners.length - 1)
    ) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newPartners = [...partners];
    
    // Swap the elements in the array
    const temp = newPartners[index];
    newPartners[index] = newPartners[newIndex];
    newPartners[newIndex] = temp;
    
    // Swap their display_order values
    const tempOrder = newPartners[index].display_order;
    newPartners[index].display_order = newPartners[newIndex].display_order;
    newPartners[newIndex].display_order = tempOrder;

    // Optimistic UI update
    setPartners(newPartners);

    // Persist to backend (update both swapped partners)
    try {
      const formData1 = new FormData();
      formData1.append('name', newPartners[index].name);
      formData1.append('display_order', newPartners[index].display_order);
      
      const formData2 = new FormData();
      formData2.append('name', newPartners[newIndex].name);
      formData2.append('display_order', newPartners[newIndex].display_order);

      await Promise.all([
        api.put(`/admin/partners/${newPartners[index].id}`, formData1, { headers: { 'Content-Type': 'multipart/form-data' } }),
        api.put(`/admin/partners/${newPartners[newIndex].id}`, formData2, { headers: { 'Content-Type': 'multipart/form-data' } })
      ]);
      
    } catch (error) {
      showToast('Failed to save new order', 'error');
      fetchPartners(); // Revert on failure
    }
  };

  const isFormValid = name.trim() !== '' && (preview !== null);

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
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Manage Partners</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] font-medium">Add, edit, and reorder the bank partners shown on property listings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-[var(--color-border-subtle)] sticky top-6">
            <h2 className="text-xl font-extrabold text-[var(--color-text-primary)] mb-6">
              {isEditing ? 'Edit Partner' : 'Add New Partner'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="flex flex-col">
                <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5">
                  Partner Name <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl border border-gray-200 bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent focus-within:bg-white transition-all duration-200">
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. HDFC Bank"
                    className="block w-full px-4 py-3 text-[14px] border-transparent bg-transparent outline-none text-[var(--color-text-primary)] placeholder-gray-400" 
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5">
                  Display Order <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl border border-gray-200 bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent focus-within:bg-white transition-all duration-200">
                  <input 
                    type="number" 
                    required 
                    value={displayOrder} 
                    onChange={e => setDisplayOrder(e.target.value)}
                    className="block w-full px-4 py-3 text-[14px] border-transparent bg-transparent outline-none text-[var(--color-text-primary)] placeholder-gray-400" 
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5">
                  Partner Logo <span className="text-red-500">*</span>
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
                  <div className="mt-1 relative group w-full h-32 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                    <img src={preview} alt="Preview" className="max-h-full max-w-full p-4 object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={() => { setPreview(null); setFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} 
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all"
                      >
                        <X size={16} />
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
                    <><Plus className="mr-2 h-4 w-4 inline" /> {isEditing ? 'Update Partner' : 'Save Partner'}</>
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
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-border-subtle)] overflow-hidden flex flex-col h-[700px]">
            <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
              <table className="w-full text-left border-collapse relative">
                <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider w-20">Reorder</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider w-32">Logo</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Partner Name</th>
                    <th className="px-6 py-4 text-right text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)]">
                  {partners.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                            <ImageIcon className="h-8 w-8 text-gray-300" />
                          </div>
                          <p className="text-[15px] font-bold text-[var(--color-text-primary)]">No partners found</p>
                          <p className="text-[13px] mt-1">Use the form to add a new bank partner.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    partners.map((partner, index) => (
                      <tr key={partner.id} className="even:bg-gray-50/30 hover:bg-blue-50/40 transition-colors group">
                        
                        {/* Reorder Arrows */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col items-center justify-center space-y-1">
                            <button 
                              onClick={() => handleReorder(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-[var(--color-primary)] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                            >
                              <ArrowUp size={16} />
                            </button>
                            <span className="text-[11px] font-bold text-gray-400 bg-white px-1.5 rounded-sm border border-gray-100">{partner.display_order}</span>
                            <button 
                              onClick={() => handleReorder(index, 'down')}
                              disabled={index === partners.length - 1}
                              className="p-1 text-gray-400 hover:text-[var(--color-primary)] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                            >
                              <ArrowDown size={16} />
                            </button>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {partner.logo_cloudinary_url ? (
                            <div className="h-16 w-28 bg-gray-50 border border-gray-200/60 rounded-xl shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] p-2 flex items-center justify-center overflow-hidden">
                              <img src={partner.logo_cloudinary_url} alt={partner.name} className="max-h-full max-w-full object-contain" />
                            </div>
                          ) : (
                            <div className="h-16 w-28 bg-gray-50 border border-gray-200 border-dashed rounded-xl flex items-center justify-center text-gray-400">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-[15px] font-extrabold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{partner.name}</div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => handleEdit(partner)} 
                              className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => confirmDelete(partner)} 
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
              onClick={() => !isDeleting && setDeleteModal({ show: false, partner: null })}
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
                  <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-2">Delete Partner?</h3>
                  <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed px-4">
                    Are you sure you want to delete <span className="font-bold text-[var(--color-text-primary)]">"{deleteModal.partner?.name}"</span>? 
                    This will permanently remove the logo from your servers.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 flex gap-4 mt-2 border-t border-[var(--color-border-subtle)]">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setDeleteModal({ show: false, partner: null })}
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

export default ManagePartners;
