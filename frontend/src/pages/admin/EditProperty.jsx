import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { FiUploadCloud, FiX, FiCheck, FiChevronRight, FiChevronLeft, FiImage, FiMapPin, FiHome, FiInfo } from 'react-icons/fi';

const InputField = ({ label, name, type = 'text', value, onChange, placeholder }) => (
  <div className='flex flex-col'>
    <label className='block text-xs font-semibold text-gray-900 mb-1.5'>{label}</label>
    <div className='relative rounded-lg border border-gray-200 bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-600 focus-within:bg-white transition-all duration-200'>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className='block w-full px-4 py-2.5 sm:text-sm border-transparent bg-transparent outline-none text-gray-800 placeholder-gray-400'
        placeholder={placeholder || `Enter ${label}`}
      />
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, options, disabled = false, defaultOption = null }) => (
  <div className='flex flex-col'>
    <label className='block text-xs font-semibold text-gray-900 mb-1.5'>{label}</label>
    <div className='relative rounded-lg border border-gray-200 bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-600 focus-within:bg-white transition-all duration-200'>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className='block w-full px-4 py-2.5 pr-10 sm:text-sm border-transparent bg-transparent appearance-none outline-none text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <option value='' disabled>{defaultOption || `Select ${label}`}</option>
        {options.map((opt, idx) => {
          const optValue = typeof opt === 'object' ? (opt.id !== undefined ? opt.id : opt.value) : opt;
          const optLabel = typeof opt === 'object' ? (opt.name !== undefined ? opt.name : opt.label) : opt;
          return <option key={idx} value={optValue}>{optLabel}</option>;
        })}
      </select>
      <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
        <svg className='h-4 w-4 text-gray-400' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
          <path fillRule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clipRule='evenodd' />
        </svg>
      </div>
    </div>
  </div>
);

const steps = [
  { id: 1, title: 'Basic Info', icon: FiInfo },
  { id: 2, title: 'Configuration', icon: FiHome },
  { id: 3, title: 'Location', icon: FiMapPin },
  { id: 4, title: 'Media', icon: FiImage },
];

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

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
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, stateRes, partnerRes, propRes] = await Promise.all([
          api.get('/categories'),
          api.get('/states'),
          api.get('/partners').catch(() => ({ data: { data: [] } })),
          api.get(`/properties/${id}`)
        ]);
        setCategories(catRes.data.data || []);
        setStates(stateRes.data.data || []);
        setPartners(partnerRes.data.data || []);

        const propData = propRes.data.data;
        if (propData) {
          setFormData({
            title: propData.title || '', 
            description: propData.description || '', 
            price: propData.price || '', 
            bhk: propData.bhk || '', 
            sq_feet: propData.sq_feet || '', 
            sq_yard: propData.sq_yard || '',
            listing_type: propData.listing_type || '', 
            category_id: propData.PropertyType?.category_id || '', 
            property_type_id: propData.property_type_id || '',
            state_id: propData.state_id || '', 
            city_id: propData.city_id || '', 
            area_id: propData.area_id || '',
            bathrooms: propData.bathrooms || '', balconies: propData.balconies || '', 
            area_type: propData.area_type || '', maintenance_charge: propData.maintenance_charge || '',
            floor_number: propData.floor_number || '', total_floors: propData.total_floors || '', 
            age_of_property: propData.age_of_property || '', covered_parking: propData.covered_parking || '',
            open_parking: propData.open_parking || '', furnishing_status: propData.furnishing_status || '', 
            construction_status: propData.construction_status || '', brokerage_charge: propData.brokerage_charge || '',
            partner_id: propData.partner_id || '', garage: propData.garage || '', transaction_type: propData.transaction_type || '', 
            available_from: propData.available_from ? propData.available_from.split('T')[0] : '',
            flat_no: propData.flat_no || '', property_label: propData.property_label || '', 
            address_line_1: propData.address_line_1 || '', charge_brokerage: propData.charge_brokerage || false
          });

          if (propData.PropertyImages && propData.PropertyImages.length > 0) {
            setExistingImages(propData.PropertyImages);
          }
        }
      } catch (err) {
        console.error('Failed to load initial data', err);
        setError('Failed to load property data');
      }
    };
    fetchInitialData();
  }, [id]);

  // Fetch Types when Category changes
  useEffect(() => {
    if (formData.category_id) {
      api.get(`/types/${formData.category_id}`).then(res => {
        setTypes(res.data.data || []);
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
      });
    } else {
      setAreas([]);
    }
  }, [formData.city_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    if (existingImages.length - removedImages.length + images.length + files.length > 10) {
      alert("You can only have a maximum of 10 images.");
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

  const removeExistingImage = (public_id) => {
    setExistingImages(prev => prev.filter(img => img.cloudinary_public_id !== public_id));
    setRemovedImages(prev => [...prev, public_id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      if (removedImages.length > 0) {
        data.append('removedImages', JSON.stringify(removedImages));
      }

      await api.put(`/admin/properties/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/admin/properties');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InputField label="Property Name" name="title" value={formData.title} onChange={handleChange} />
            <SelectField label="Category" name="category_id" value={formData.category_id} onChange={handleChange} options={categories} />
            <SelectField label="Property Type (Sub-type)" name="property_type_id" value={formData.property_type_id} onChange={handleChange} options={types} disabled={!formData.category_id || types.length === 0} defaultOption={types.length === 0 ? (formData.category_id ? "No sub-types" : "Select category first") : "Select Property Type"} />
            <SelectField label="Partner (Bank Partner)" name="partner_id" value={formData.partner_id} onChange={handleChange} options={partners} />
            <SelectField label="Property For" name="listing_type" value={formData.listing_type} onChange={handleChange} options={[{id: 'sale', name: 'Sale'}, {id: 'rent', name: 'Rent'}, {id: 'preleased', name: 'Pre-Leased'}, {id: 'auction', name: 'Bank Auction'}]} />
            <InputField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} />
            <SelectField label="Transaction Type" name="transaction_type" value={formData.transaction_type} onChange={handleChange} options={["New Property", "Resale"]} />
            <SelectField label="Property Label" name="property_label" value={formData.property_label} onChange={handleChange} options={["Available", "Sold"]} />
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InputField label="Area(in Square Yard)" name="sq_yard" value={formData.sq_yard} onChange={handleChange} />
            <InputField label="Area(in Square Foot)" name="sq_feet" value={formData.sq_feet} onChange={handleChange} />
            <SelectField label="BHK" name="bhk" value={formData.bhk} onChange={handleChange} options={[1,2,3,4,5,"5+"]} />
            <SelectField label="Bath" name="bathrooms" value={formData.bathrooms} onChange={handleChange} options={[1,2,3,4,5,"5+"]} />
            <SelectField label="Balcony" name="balconies" value={formData.balconies} onChange={handleChange} options={[0,1,2,3,"3+"]} />
            <SelectField label="Garage" name="garage" value={formData.garage} onChange={handleChange} options={["Yes", "No"]} />
            <SelectField label="Covered Parking (Basement/Stilt)" name="covered_parking" value={formData.covered_parking} onChange={handleChange} options={[0,1,2,3,"3+"]} />
            <SelectField label="Open Parking (Uncovered)" name="open_parking" value={formData.open_parking} onChange={handleChange} options={[0,1,2,3,"3+"]} />
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SelectField label="Construction Status" name="construction_status" value={formData.construction_status} onChange={handleChange} options={["Ready To Move", "Under Construction"]} />
            <SelectField label="Furnish Type" name="furnishing_status" value={formData.furnishing_status} onChange={handleChange} options={["Unfurnished", "Semi Furnished", "Fully Furnished"]} />
            <InputField label="Maintenance" name="maintenance_charge" type="number" value={formData.maintenance_charge} onChange={handleChange} />
            <SelectField label="Age Of Property" name="age_of_property" value={formData.age_of_property} onChange={handleChange} options={["0-1 Years", "1-5 Years", "5-10 Years", "10+ Years"]} />
            <InputField label="Date" name="available_from" type="date" value={formData.available_from} onChange={handleChange} />
            
            <InputField label="Flat/House No" name="flat_no" value={formData.flat_no} onChange={handleChange} />
            <InputField label="Floor No" name="floor_number" value={formData.floor_number} onChange={handleChange} />
            <InputField label="Total Floors" name="total_floors" value={formData.total_floors} onChange={handleChange} />
            
            <SelectField label="State" name="state_id" value={formData.state_id} onChange={handleChange} options={states} />
            <SelectField label="City" name="city_id" value={formData.city_id} onChange={handleChange} options={cities} disabled={!formData.state_id} />
            <SelectField label="Area" name="area_id" value={formData.area_id} onChange={handleChange} options={areas} disabled={!formData.city_id} />
            <InputField label="Address Line 1" name="address_line_1" value={formData.address_line_1} onChange={handleChange} />
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <label className="flex items-center space-x-3 text-sm font-semibold text-gray-800 cursor-pointer">
                <div className="relative flex items-center">
                  <input type="checkbox" name="charge_brokerage" checked={formData.charge_brokerage} onChange={(e) => setFormData({...formData, charge_brokerage: e.target.checked})} className="peer sr-only" />
                  <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
                <span>Do You Charge Brokerage?</span>
              </label>
              
              {formData.charge_brokerage && (
                <div className="mt-4">
                  <InputField label="Brokerage Amount (₹)" name="brokerage_charge" type="number" value={formData.brokerage_charge} onChange={handleChange} placeholder="e.g. 50000" />
                </div>
              )}
              
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">Description</label>
                <textarea 
                  name="description" 
                  rows="4" 
                  value={formData.description} 
                  onChange={handleChange} 
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all duration-200" 
                  placeholder="Write a detailed description about the property..."
                ></textarea>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-800">Gallery Images</h3>
                <span className="text-xs text-gray-500">Max 10 total images</span>
              </div>
              
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="sr-only" onChange={handleImageChange} />
                <div className="bg-white w-14 h-14 mx-auto rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FiUploadCloud className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Click to upload or drag & drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or WEBP (max. 10MB)</p>
              </div>
              
              {(imagePreviews.length > 0 || existingImages.length > 0) && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {existingImages.map((img) => (
                    <div key={img.cloudinary_public_id} className="relative group rounded-xl overflow-hidden bg-gray-50 aspect-square shadow-sm">
                      <img src={img.cloudinary_url} alt="existing" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); removeExistingImage(img.cloudinary_public_id); }}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform scale-75 group-hover:scale-100 transition-all shadow-md"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                      {img.is_primary && (
                        <div className="absolute bottom-0 inset-x-0 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold text-center py-1 uppercase tracking-wider">Primary</div>
                      )}
                    </div>
                  ))}
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden bg-gray-50 aspect-square shadow-sm border-2 border-blue-400">
                      <img src={preview} alt={`preview ${index}`} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform scale-75 group-hover:scale-100 transition-all shadow-md"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold text-center py-1 uppercase tracking-wider">New</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f4f7f6] py-10 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        
        {/* Header section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Property</h1>
          <p className="mt-2 text-sm text-gray-500">Update the details for this existing property.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-start shadow-sm">
            <FiInfo className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-200">
          
          {/* Stepper Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-5 sm:px-10">
            <div className="flex items-center justify-between">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex flex-col items-center relative z-10 w-full">
                    <div 
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                        ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-110' : 
                          isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                      `}
                    >
                      {isCompleted ? <FiCheck size={18} /> : <Icon size={18} />}
                    </div>
                    <span className={`mt-3 text-xs font-medium tracking-wide hidden sm:block ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                    
                    {/* Connecting line */}
                    {idx < steps.length - 1 && (
                      <div className="absolute top-5 left-[50%] w-full h-[2px] -z-10">
                        <div className="h-full bg-gray-200 w-full absolute top-0"></div>
                        <div 
                          className="h-full bg-blue-600 absolute top-0 transition-all duration-500 ease-in-out" 
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
          <form onSubmit={(e) => {
            e.preventDefault();
            if (currentStep < steps.length) {
              setCurrentStep(c => c + 1);
            }
          }}>
            <div className="p-6 sm:p-10 min-h-[400px]">
              {renderStepContent()}
            </div>
            
            {/* Footer Navigation */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-5 sm:px-10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => currentStep > 1 ? setCurrentStep(c => c - 1) : navigate('/admin/properties')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                {currentStep > 1 ? (
                  <><FiChevronLeft className="mr-2 h-4 w-4" /> Back</>
                ) : 'Cancel'}
              </button>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setCurrentStep(c => c + 1); }}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-blue-500/30"
                >
                  Next Step <FiChevronRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 transition-all shadow-green-500/30"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    <><FiCheck className="mr-2 h-4 w-4" /> Update Property</>
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

export default EditProperty;