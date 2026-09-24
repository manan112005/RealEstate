import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Search, Map, MapPin, Navigation, Home as HomeIcon, IndianRupee } from 'lucide-react';
import Button from '../ui/Button';

const QuickFilterBar = () => {
  const navigate = useNavigate();
  
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [filters, setFilters] = useState({ 
    state_id: '', 
    city_id: '', 
    area_id: '', 
    category_id: '', 
    price_range: '' 
  });

  useEffect(() => {
    // Fetch categories
    api.get('/categories').then(res => setCategories(res.data.data || [])).catch(console.error);
    
    // Fetch initial states
    api.get('/states').then(res => setStates(res.data.data || [])).catch(console.error);
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (filters.state_id) {
      api.get(`/cities/${filters.state_id}`)
        .then(res => setCities(res.data.data || []))
        .catch(console.error);
    } else {
      setCities([]);
    }
    // Reset city and area
    setFilters(prev => ({ ...prev, city_id: '', area_id: '' }));
  }, [filters.state_id]);

  // Fetch areas when city changes
  useEffect(() => {
    if (filters.city_id) {
      api.get(`/areas/${filters.city_id}`)
        .then(res => setAreas(res.data.data || []))
        .catch(console.error);
    } else {
      setAreas([]);
    }
    // Reset area
    setFilters(prev => ({ ...prev, area_id: '' }));
  }, [filters.city_id]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.state_id) params.append('state_id', filters.state_id);
    if (filters.city_id) params.append('city_id', filters.city_id);
    if (filters.area_id) params.append('area_id', filters.area_id);
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.price_range) params.append('price_range', filters.price_range);
    
    navigate(`/properties?${params.toString()}`);
  };

  const SelectInput = ({ label, icon: Icon, value, onChange, options, placeholder, optionsIsObject = true, disabled = false }) => (
    <div className={`relative flex-1 px-4 py-3 hover:bg-gray-50 transition-colors border-r border-gray-100 last:border-r-0 first:rounded-l-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-1">
        {label}
      </label>
      <div className="flex items-center">
        {Icon && <Icon size={16} className="text-gray-500 mr-2 shrink-0" strokeWidth={1.5} />}
        <select 
          value={value} 
          onChange={onChange}
          disabled={disabled}
          className={`w-full bg-transparent text-[14px] font-medium text-gray-700 focus:outline-none cursor-pointer appearance-none truncate pr-4 ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          <option value="">{placeholder}</option>
          {optionsIsObject ? options.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          )) : options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 mt-1 pointer-events-none">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );

  const priceRanges = [
    { value: '0-5000000', label: 'Under ₹50L' },
    { value: '5000000-10000000', label: '₹50L - ₹1Cr' },
    { value: '10000000-50000000', label: '₹1Cr - ₹5Cr' },
    { value: '50000000-', label: 'Over ₹5Cr' }
  ];

  return (
    <div className="w-full max-w-[1100px] mx-auto z-30">
      <form onSubmit={handleSearch} className="bg-white rounded-full shadow-lg flex flex-col md:flex-row items-stretch p-1 relative border border-gray-100">
        
        <SelectInput 
          label="State" 
          icon={Map}
          placeholder="Anywhere"
          value={filters.state_id} 
          onChange={e => setFilters({...filters, state_id: e.target.value})} 
          options={states} 
        />
        
        <SelectInput 
          label="City" 
          icon={MapPin}
          placeholder="Select City"
          value={filters.city_id} 
          onChange={e => setFilters({...filters, city_id: e.target.value})} 
          options={cities} 
          disabled={!filters.state_id}
        />

        <SelectInput 
          label="Area" 
          icon={Navigation}
          placeholder="Select Area"
          value={filters.area_id} 
          onChange={e => setFilters({...filters, area_id: e.target.value})} 
          options={areas} 
          disabled={!filters.city_id}
        />

        <SelectInput 
          label="Property" 
          icon={HomeIcon}
          placeholder="All Types"
          value={filters.category_id} 
          onChange={e => setFilters({...filters, category_id: e.target.value})} 
          options={categories} 
        />

        <SelectInput 
          label="Price Range" 
          icon={IndianRupee}
          placeholder="₹0.5L - ₹5.00Cr"
          value={filters.price_range} 
          onChange={e => setFilters({...filters, price_range: e.target.value})} 
          options={priceRanges} 
          optionsIsObject={false}
        />
        
        <div className="shrink-0 flex items-center justify-center p-1 md:ml-1">
          <Button 
            type="submit" 
            className="!rounded-full h-full min-h-[46px] px-7 text-[15px] font-medium !bg-[#17528e] hover:!bg-[#124273] text-white !border-none flex items-center shadow-md"
          >
            <Search size={18} className="mr-2" strokeWidth={2.5} /> Search
          </Button>
        </div>

      </form>
    </div>
  );
};

export default QuickFilterBar;
