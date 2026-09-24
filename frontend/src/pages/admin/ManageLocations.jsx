import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, MapPin, Map, Navigation, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';

const ManageLocations = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [newState, setNewState] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newArea, setNewArea] = useState('');

  // Modal & Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, type: '', name: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch initial states
  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const res = await api.get('/states');
      setStates(res.data.data || []);
    } catch (err) {
      showToast('Failed to fetch states', 'error');
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const res = await api.get(`/cities/${stateId}`);
      setCities(res.data.data || []);
    } catch (err) {
      showToast('Failed to fetch cities', 'error');
    }
  };

  const fetchAreas = async (cityId) => {
    try {
      const res = await api.get(`/areas/${cityId}`);
      setAreas(res.data.data || []);
    } catch (err) {
      showToast('Failed to fetch areas', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // State Actions
  const handleAddState = async (e) => {
    e.preventDefault();
    if (!newState.trim()) return;
    try {
      await api.post('/admin/states', { name: newState });
      setNewState('');
      fetchStates();
      showToast('State added successfully');
    } catch (err) { 
      showToast('Error adding state', 'error'); 
    }
  };

  // City Actions
  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!newCity.trim() || !selectedState) return;
    try {
      await api.post('/admin/cities', { name: newCity, state_id: selectedState });
      setNewCity('');
      fetchCities(selectedState);
      showToast('City added successfully');
    } catch (err) { 
      showToast('Error adding city', 'error'); 
    }
  };

  // Area Actions
  const handleAddArea = async (e) => {
    e.preventDefault();
    if (!newArea.trim() || !selectedCity) return;
    try {
      await api.post('/admin/areas', { name: newArea, city_id: selectedCity });
      setNewArea('');
      fetchAreas(selectedCity);
      showToast('Area added successfully');
    } catch (err) { 
      showToast('Error adding area', 'error'); 
    }
  };

  // Delete Actions
  const confirmDelete = (type, id, name) => {
    setDeleteModal({ show: true, type, id, name });
  };

  const executeDelete = async () => {
    const { type, id } = deleteModal;
    setIsDeleting(true);
    
    try {
      if (type === 'state') {
        await api.delete(`/admin/states/${id}`);
        fetchStates();
        if (selectedState === id) setSelectedState(null);
        showToast('State deleted successfully');
      } 
      else if (type === 'city') {
        await api.delete(`/admin/cities/${id}`);
        fetchCities(selectedState);
        if (selectedCity === id) setSelectedCity(null);
        showToast('City deleted successfully');
      } 
      else if (type === 'area') {
        await api.delete(`/admin/areas/${id}`);
        fetchAreas(selectedCity);
        showToast('Area deleted successfully');
      }
    } catch (err) {
      showToast(`Error deleting ${type}. It may be in use by properties.`, 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ show: false, id: null, type: '', name: '' });
    }
  };

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
        <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Manage Locations</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)] font-medium">Add, edit, or remove states, cities, and local areas.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* States Column */}
        <div className="bg-white shadow-sm border border-[var(--color-border-subtle)] rounded-2xl flex flex-col h-[700px] overflow-hidden">
          <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] bg-gray-50/50 p-5">
            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center shrink-0">
              <Map size={20} />
            </div>
            <h2 className="font-extrabold text-[15px] text-[var(--color-text-primary)] uppercase tracking-wide">States</h2>
          </div>
          
          <div className="p-4 border-b border-[var(--color-border-subtle)] bg-white">
            <form onSubmit={handleAddState} className="flex gap-2">
              <input 
                type="text" 
                placeholder="New State Name..." 
                value={newState} 
                onChange={e => setNewState(e.target.value)} 
                className="flex-1 rounded-xl border-gray-200 border px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-gray-50 focus:bg-white transition-all shadow-sm" 
              />
              <button 
                type="submit" 
                disabled={!newState.trim()}
                className="bg-[var(--color-primary)] text-white px-5 rounded-xl hover:bg-[var(--color-secondary)] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Plus size={20} />
              </button>
            </form>
          </div>
          
          <ul className="flex-1 overflow-y-auto divide-y divide-[var(--color-border-subtle)] custom-scrollbar">
            {states.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-secondary)]">
                <Map size={48} className="text-gray-200 mb-4" />
                <p className="text-[14px] font-bold">No States Found</p>
                <p className="text-[13px]">Add a state to begin</p>
              </div>
            ) : (
              states.map(s => {
                const isSelected = selectedState === s.id;
                return (
                  <li 
                    key={s.id} 
                    className={`group flex justify-between items-center p-4 cursor-pointer transition-all relative ${
                      isSelected ? 'bg-blue-50/80' : 'hover:bg-gray-50'
                    }`} 
                    onClick={() => { setSelectedState(s.id); setSelectedCity(null); fetchCities(s.id); }}
                  >
                    {/* Active Accent Bar */}
                    {isSelected && (
                      <motion.div layoutId="state-accent" className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></motion.div>
                    )}
                    
                    <span className={`text-[14px] font-bold pl-2 ${isSelected ? 'text-blue-700' : 'text-[var(--color-text-primary)]'}`}>
                      {s.name}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <ChevronRight size={18} className={`transition-all ${isSelected ? 'text-blue-500 opacity-100' : 'text-gray-300 opacity-0 group-hover:opacity-100'}`} />
                      <button 
                        onClick={(e) => { e.stopPropagation(); confirmDelete('state', s.id, s.name); }} 
                        className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Cities Column */}
        <div className={`bg-white shadow-sm border border-[var(--color-border-subtle)] rounded-2xl flex flex-col h-[700px] overflow-hidden transition-all duration-300 ${!selectedState ? 'opacity-60 grayscale-[50%]' : ''}`}>
          <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] bg-gray-50/50 p-5">
            <div className={`w-10 h-10 ${selectedState ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-500'} rounded-xl flex items-center justify-center shrink-0 transition-colors`}>
              <MapPin size={20} />
            </div>
            <h2 className="font-extrabold text-[15px] text-[var(--color-text-primary)] uppercase tracking-wide">Cities</h2>
          </div>
          
          <div className="p-4 border-b border-[var(--color-border-subtle)] bg-white relative">
            {!selectedState && <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px]"></div>}
            <form onSubmit={handleAddCity} className="flex gap-2">
              <input 
                type="text" 
                placeholder="New City Name..." 
                value={newCity} 
                onChange={e => setNewCity(e.target.value)} 
                disabled={!selectedState} 
                className="flex-1 rounded-xl border-gray-200 border px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all shadow-sm disabled:opacity-50" 
              />
              <button 
                type="submit" 
                disabled={!selectedState || !newCity.trim()} 
                className="bg-indigo-600 text-white px-5 rounded-xl hover:bg-indigo-700 transition-all shadow-md disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center"
              >
                <Plus size={20} />
              </button>
            </form>
          </div>
          
          <ul className="flex-1 overflow-y-auto divide-y divide-[var(--color-border-subtle)] custom-scrollbar">
            {!selectedState ? (
              <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-secondary)]">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <Map size={24} className="text-indigo-300" />
                </div>
                <p className="text-[14px] font-bold text-[var(--color-text-primary)]">Select a State</p>
                <p className="text-[13px]">Choose a state to view its cities</p>
              </div>
            ) : cities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-secondary)]">
                <MapPin size={48} className="text-gray-200 mb-4" />
                <p className="text-[14px] font-bold text-[var(--color-text-primary)]">No Cities Found</p>
                <p className="text-[13px]">Add a city to this state</p>
              </div>
            ) : (
              cities.map(c => {
                const isSelected = selectedCity === c.id;
                return (
                  <li 
                    key={c.id} 
                    className={`group flex justify-between items-center p-4 cursor-pointer transition-all relative ${
                      isSelected ? 'bg-indigo-50/80' : 'hover:bg-gray-50'
                    }`} 
                    onClick={() => { setSelectedCity(c.id); fetchAreas(c.id); }}
                  >
                    {/* Active Accent Bar */}
                    {isSelected && (
                      <motion.div layoutId="city-accent" className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600"></motion.div>
                    )}
                    
                    <span className={`text-[14px] font-bold pl-2 ${isSelected ? 'text-indigo-700' : 'text-[var(--color-text-primary)]'}`}>
                      {c.name}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <ChevronRight size={18} className={`transition-all ${isSelected ? 'text-indigo-500 opacity-100' : 'text-gray-300 opacity-0 group-hover:opacity-100'}`} />
                      <button 
                        onClick={(e) => { e.stopPropagation(); confirmDelete('city', c.id, c.name); }} 
                        className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Areas Column */}
        <div className={`bg-white shadow-sm border border-[var(--color-border-subtle)] rounded-2xl flex flex-col h-[700px] overflow-hidden transition-all duration-300 ${!selectedCity ? 'opacity-60 grayscale-[50%]' : ''}`}>
          <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] bg-gray-50/50 p-5">
            <div className={`w-10 h-10 ${selectedCity ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'} rounded-xl flex items-center justify-center shrink-0 transition-colors`}>
              <Navigation size={20} />
            </div>
            <h2 className="font-extrabold text-[15px] text-[var(--color-text-primary)] uppercase tracking-wide">Areas / Localities</h2>
          </div>
          
          <div className="p-4 border-b border-[var(--color-border-subtle)] bg-white relative">
            {!selectedCity && <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px]"></div>}
            <form onSubmit={handleAddArea} className="flex gap-2">
              <input 
                type="text" 
                placeholder="New Area Name..." 
                value={newArea} 
                onChange={e => setNewArea(e.target.value)} 
                disabled={!selectedCity} 
                className="flex-1 rounded-xl border-gray-200 border px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all shadow-sm disabled:opacity-50" 
              />
              <button 
                type="submit" 
                disabled={!selectedCity || !newArea.trim()} 
                className="bg-emerald-600 text-white px-5 rounded-xl hover:bg-emerald-700 transition-all shadow-md disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center"
              >
                <Plus size={20} />
              </button>
            </form>
          </div>
          
          <ul className="flex-1 overflow-y-auto divide-y divide-[var(--color-border-subtle)] custom-scrollbar">
            {!selectedCity ? (
              <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-secondary)]">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <MapPin size={24} className="text-emerald-300" />
                </div>
                <p className="text-[14px] font-bold text-[var(--color-text-primary)]">Select a City</p>
                <p className="text-[13px]">Choose a city to view its areas</p>
              </div>
            ) : areas.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-secondary)]">
                <Navigation size={48} className="text-gray-200 mb-4" />
                <p className="text-[14px] font-bold text-[var(--color-text-primary)]">No Areas Found</p>
                <p className="text-[13px]">Add an area to this city</p>
              </div>
            ) : (
              areas.map(a => (
                <li key={a.id} className="group flex justify-between items-center p-4 hover:bg-gray-50 transition-all">
                  <span className="text-[14px] font-bold text-[var(--color-text-primary)] pl-2">{a.name}</span>
                  <button 
                    onClick={() => confirmDelete('area', a.id, a.name)} 
                    className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))
            )}
          </ul>
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
              onClick={() => !isDeleting && setDeleteModal({ show: false, id: null, type: '', name: '' })}
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
                  <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-2 capitalize">Delete {deleteModal.type}?</h3>
                  <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed px-4">
                    Are you sure you want to delete <span className="font-bold text-[var(--color-text-primary)]">"{deleteModal.name}"</span>? 
                    {deleteModal.type === 'state' && " This may fail if there are cities or properties associated with it."}
                    {deleteModal.type === 'city' && " This may fail if there are areas or properties associated with it."}
                  </p>
                </div>
                <div className="bg-gray-50 p-6 flex gap-4 mt-2 border-t border-[var(--color-border-subtle)]">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setDeleteModal({ show: false, id: null, type: '', name: '' })}
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
      
      {/* Custom Scrollbar Styles for this page */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; margin: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
      `}} />
    </div>
  );
};

export default ManageLocations;