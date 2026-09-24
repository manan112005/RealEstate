import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { UploadCloud, X, Check, ChevronRight, ChevronLeft, Image as ImageIcon, MapPin, Home, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InputField = ({ label, name, type = 'text', value, onChange, placeholder, error, required }) => (
  <div className='flex flex-col'>
    <label className='block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5'>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className={`relative rounded-xl border ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent focus-within:bg-white transition-all duration-200`}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full px-4 py-3 sm:text-sm border-transparent bg-transparent outline-none ${error ? 'text-red-900 placeholder-red-300' : 'text-[var(--color-text-primary)] placeholder-gray-400'}`}
        placeholder={placeholder || `Enter ${label}`}
      />
    </div>
    {error && <span className="text-red-500 text-xs mt-1.5 font-medium">{error}</span>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, disabled = false, defaultOption = null, error, required }) => (
  <div className='flex flex-col'>
    <label className='block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5'>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className={`relative rounded-xl border ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent focus-within:bg-white transition-all duration-200 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`block w-full px-4 py-3 pr-10 sm:text-sm border-transparent bg-transparent appearance-none outline-none ${error ? 'text-red-900' : 'text-[var(--color-text-primary)]'} disabled:cursor-not-allowed`}
      >
        <option value='' disabled>{defaultOption || `Select ${label}`}</option>
        {options.map((opt, idx) => {
          const optValue = typeof opt === 'object' ? (opt.id !== undefined ? opt.id : opt.value) : opt;
          const optLabel = typeof opt === 'object' ? (opt.name !== undefined ? opt.name : opt.label) : opt;
          return <option key={idx} value={optValue}>{optLabel}</option>;
        })}
      </select>
      <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
        <svg className={`h-4 w-4 ${error ? 'text-red-400' : 'text-gray-400'}`} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
          <path fillRule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clipRule='evenodd' />
        </svg>
      </div>
    </div>
    {error && <span className="text-red-500 text-xs mt-1.5 font-medium">{error}</span>}
  </div>
);

const steps = [
  { id: 1, title: 'Basic Info', icon: Info },
  { id: 2, title: 'Configuration', icon: Home },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Media', icon: ImageIcon },
];

const AddProperty = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', bhk: '', sq_feet: '', sq_yard: '',
    listing_type: '', category_id: '', property_type_id: '',
    state_id: '', city_id: '', area_id: '',
    bathrooms: '', balconies: '', area_type: '', maintenance_charge: '',
    floor_number: '', total_floors: '', age_of_property: '', covered_parking: '',
    open_parking: '', furnishing_status: '', construction_status: '', brokerage_charge: '',
    partner_id: '', garage: '', transaction_type: '', available_from: '',
    flat_no: '', property_label: '', address_line_1: '', charge_brokerage: false
  });

  // Dropdown Data State
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [partners, setPartners] = useState([]);

  // Images State
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, stateRes, partnerRes] = await Promise.all([
          api.get('/categories'),
          api.get('/states'),
          api.get('/partners').catch(() => ({ data: { data: [] } }))
        ]);
        setCategories(catRes.data.data || []);
        setStates(stateRes.data.data || []);
        setPartners(partnerRes.data.data || []);
      } catch (err) {
        console.error('Failed to load dropdowns', err);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch Types when Category changes
  useEffect(() => {
    if (formData.category_id) {
      api.get(`/types/${formData.category_id}`).then(res => {
        setTypes(res.data.data || []);
        setFormData(prev => ({ ...prev, property_type_id: '' }));
      });
    } else {
      setTypes([]);
    }
  }, [formData.category_id]);

  // Fetch Cities when State changes
  useEffect(() => {
    if (formData.state_id) {
      api.get(`/cities/${formData.state_id}`).then(res => {
        setCities(res.data.data || []);
        setFormData(prev => ({ ...prev, city_id: '', area_id: '' }));
      });
    } else {
      setCities([]);
      setAreas([]);
    }
  }, [formData.state_id]);

  // Fetch Areas when City changes
  useEffect(() => {
    if (formData.city_id) {
      api.get(`/areas/${formData.city_id}`).then(res => {
        setAreas(res.data.data || []);
        setFormData(prev => ({ ...prev, area_id: '' }));
      });
    } else {
      setAreas([]);
    }
  }, [formData.city_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field as user types
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: null });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    addImages(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
    addImages(files);
  };

  const addImages = (files) => {
    if (images.length + files.length > 10) {
      showToast('You can only upload a maximum of 10 images.', 'error');
      return;
    }
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    if (type === 'success') {
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    }
  };

  const validateStep = () => {
    const errors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.title) errors.title = 'Title is required';
      if (!formData.category_id) errors.category_id = 'Category is required';
      if (!formData.listing_type) errors.listing_type = 'Property For is required';
      if (!formData.price) errors.price = 'Price is required';
      if (!formData.transaction_type) errors.transaction_type = 'Transaction Type is required';
    } 
    else if (currentStep === 2) {
      if (!formData.bhk) errors.bhk = 'BHK is required';
      if (!formData.bathrooms) errors.bathrooms = 'Bathrooms is required';
    } 
    else if (currentStep === 3) {
      if (!formData.state_id) errors.state_id = 'State is required';
      if (!formData.city_id) errors.city_id = 'City is required';
      if (!formData.area_id) errors.area_id = 'Area is required';
    }

    if (Object.keys(errors).length > 0) {
      isValid = false;
      setValidationErrors(errors);
    }

    return isValid;
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep()) {
      setCurrentStep(c => c + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Quick validate media step (optional, but good practice)
    if (images.length === 0) {
      // Not strictly required, but warn if zero images? The original didn't block on this.
    }

    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '' && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      images.forEach(image => {
        data.append("images", image);
      });

      await api.post('/admin/properties', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      showToast('Property published successfully!', 'success');
      setTimeout(() => navigate('/admin/properties'), 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property. Please try again.');
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <motion.div key={1} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField required label="Property Name" name="title" value={formData.title} onChange={handleChange} error={validationErrors.title} />
            <SelectField required label="Category" name="category_id" value={formData.category_id} onChange={handleChange} options={categories} error={validationErrors.category_id} />
            <SelectField label="Property Type (Sub-type)" name="property_type_id" value={formData.property_type_id} onChange={handleChange} options={types} disabled={!formData.category_id || types.length === 0} defaultOption={types.length === 0 ? (formData.category_id ? "No sub-types" : "Select category first") : "Select Property Type"} />
            <SelectField label="Partner (Bank Partner)" name="partner_id" value={formData.partner_id} onChange={handleChange} options={partners} />
            <SelectField required label="Property For" name="listing_type" value={formData.listing_type} onChange={handleChange} options={[{id: 'sale', name: 'Sale'}, {id: 'rent', name: 'Rent'}, {id: 'preleased', name: 'Pre-Leased'}, {id: 'auction', name: 'Bank Auction'}]} error={validationErrors.listing_type} />
            <InputField required label="Price" name="price" type="number" value={formData.price} onChange={handleChange} error={validationErrors.price} />
            <SelectField required label="Transaction Type" name="transaction_type" value={formData.transaction_type} onChange={handleChange} options={["New Property", "Resale"]} error={validationErrors.transaction_type} />
            <SelectField label="Property Label" name="property_label" value={formData.property_label} onChange={handleChange} options={["Available", "Sold"]} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div key={2} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Area(in Square Yard)" name="sq_yard" value={formData.sq_yard} onChange={handleChange} />
            <InputField label="Area(in Square Foot)" name="sq_feet" value={formData.sq_feet} onChange={handleChange} />
            <SelectField required label="BHK" name="bhk" value={formData.bhk} onChange={handleChange} options={[1,2,3,4,5,"5+"]} error={validationErrors.bhk} />
            <SelectField required label="Bath" name="bathrooms" value={formData.bathrooms} onChange={handleChange} options={[1,2,3,4,5,"5+"]} error={validationErrors.bathrooms} />
            <SelectField label="Balcony" name="balconies" value={formData.balconies} onChange={handleChange} options={[0,1,2,3,"3+"]} />
            <SelectField label="Garage" name="garage" value={formData.garage} onChange={handleChange} options={["Yes", "No"]} />
            <SelectField label="Covered Parking" name="covered_parking" value={formData.covered_parking} onChange={handleChange} options={[0,1,2,3,"3+"]} />
            <SelectField label="Open Parking" name="open_parking" value={formData.open_parking} onChange={handleChange} options={[0,1,2,3,"3+"]} />
          </motion.div>
        );
      case 3:
        return (
          <motion.div key={3} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField label="Construction Status" name="construction_status" value={formData.construction_status} onChange={handleChange} options={["Ready To Move", "Under Construction"]} />
            <SelectField label="Furnish Type" name="furnishing_status" value={formData.furnishing_status} onChange={handleChange} options={["Unfurnished", "Semi Furnished", "Fully Furnished"]} />
            <InputField label="Maintenance" name="maintenance_charge" type="number" value={formData.maintenance_charge} onChange={handleChange} />
            <SelectField label="Age Of Property" name="age_of_property" value={formData.age_of_property} onChange={handleChange} options={["0-1 Years", "1-5 Years", "5-10 Years", "10+ Years"]} />
            <InputField label="Date" name="available_from" type="date" value={formData.available_from} onChange={handleChange} />
            
            <InputField label="Flat/House No" name="flat_no" value={formData.flat_no} onChange={handleChange} />
            <InputField label="Floor No" name="floor_number" value={formData.floor_number} onChange={handleChange} />
            <InputField label="Total Floors" name="total_floors" value={formData.total_floors} onChange={handleChange} />
            
            <SelectField required label="State" name="state_id" value={formData.state_id} onChange={handleChange} options={states} error={validationErrors.state_id} />
            <SelectField required label="City" name="city_id" value={formData.city_id} onChange={handleChange} options={cities} disabled={!formData.state_id} error={validationErrors.city_id} />
            <SelectField required label="Area" name="area_id" value={formData.area_id} onChange={handleChange} options={areas} disabled={!formData.city_id} error={validationErrors.area_id} />
            <InputField label="Address Line 1" name="address_line_1" value={formData.address_line_1} onChange={handleChange} />
          </motion.div>
        );
      case 4:
        return (
          <motion.div key={4} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <label className="flex items-center space-x-3 text-sm font-bold text-[var(--color-text-primary)] cursor-pointer">
                <div className="relative flex items-center">
                  <input type="checkbox" name="charge_brokerage" checked={formData.charge_brokerage} onChange={(e) => setFormData({...formData, charge_brokerage: e.target.checked})} className="peer sr-only" />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                </div>
                <span>Do You Charge Brokerage?</span>
              </label>
              
              <AnimatePresence>
                {formData.charge_brokerage && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 overflow-hidden">
                    <InputField label="Brokerage Amount (₹)" name="brokerage_charge" type="number" value={formData.brokerage_charge} onChange={handleChange} placeholder="e.g. 50000" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="mt-8">
                <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5">Description</label>
                <textarea 
                  name="description" 
                  rows="4" 
                  value={formData.description} 
                  onChange={handleChange} 
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all duration-200 shadow-sm" 
                  placeholder="Write a detailed description about the property..."
                ></textarea>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide">Gallery Images</h3>
                <span className="text-[12px] font-bold text-[var(--color-primary)] bg-blue-50 px-3 py-1 rounded-full">{images.length}/10 images max</span>
              </div>
              
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50/50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="sr-only" onChange={handleImageChange} />
                <div className="bg-white w-16 h-16 mx-auto rounded-full shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud className="h-8 w-8 text-[var(--color-primary)]" />
                </div>
                <p className="text-[15px] font-bold text-[var(--color-text-primary)] mb-1">Click to upload or drag & drop</p>
                <p className="text-[13px] text-[var(--color-text-secondary)]">SVG, PNG, JPG or WEBP (max. 10MB)</p>
              </div>
              
              {imagePreviews.length > 0 && (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square shadow-sm border border-gray-200">
                      <img src={preview} alt={`preview ${index}`} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                          className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full transform scale-75 group-hover:scale-100 transition-all shadow-lg"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );
      default:
        return null;
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

      <div className="w-full max-w-5xl mx-auto">
        
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Add New Property</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)] font-medium">Follow the steps below to list a new property.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[14px] font-medium flex items-start shadow-sm">
            <AlertTriangle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-border-subtle)] overflow-hidden">
          
          {/* Polished Stepper Header */}
          <div className="bg-gray-50/50 border-b border-[var(--color-border-subtle)] px-6 py-8 sm:px-10">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex flex-col items-center relative z-10 w-full group">
                    <div 
                      className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ease-out
                        ${isActive ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-blue-500/30 scale-110 ring-4 ring-blue-50' : 
                          isCompleted ? 'bg-green-500 text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-400'}
                      `}
                    >
                      {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
                    </div>
                    <span className={`mt-4 text-[12px] font-bold uppercase tracking-wider hidden sm:block transition-colors ${isActive ? 'text-[var(--color-primary)]' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                    
                    {/* Connecting line */}
                    {idx < steps.length - 1 && (
                      <div className="absolute top-6 left-[50%] w-full h-1 -z-10 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-green-500 rounded-full transition-all duration-700 ease-in-out" 
                          style={{ width: currentStep > step.id ? '100%' : '0%' }}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <form>
            <div className="p-6 sm:p-10 min-h-[450px]">
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>
            </div>
            
            {/* Footer Navigation */}
            <div className="bg-gray-50/50 border-t border-[var(--color-border-subtle)] px-6 py-6 sm:px-10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => currentStep > 1 ? setCurrentStep(c => c - 1) : navigate('/admin/properties')}
                className="inline-flex items-center px-5 py-3 text-[14px] font-bold text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              >
                {currentStep > 1 ? (
                  <><ChevronLeft className="mr-2 h-4 w-4" /> Back</>
                ) : 'Cancel'}
              </button>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-6 py-3 text-[14px] font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 transition-all"
                >
                  Next Step <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center px-8 py-3 text-[14px] font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 transition-all shadow-green-500/20"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </span>
                  ) : (
                    <><Check className="mr-2 h-5 w-5" /> Publish Property</>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;