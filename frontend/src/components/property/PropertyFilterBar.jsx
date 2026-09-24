import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Filter, X, Search, RotateCcw } from 'lucide-react';
import Button from '../ui/Button';

const PropertyFilterBar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [partners, setPartners] = useState([]);

  const [filters, setFilters] = useState({
    listing_type: '', category_id: '', state_id: '', city_id: '', area_id: '', bhk: '', partner_id: ''
  });
  
  const [priceRange, setPriceRange] = useState([50000, 50000000]);

  // Sync state with URL params on mount & location change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters({
      listing_type: params.get('listing_type') || '',
      category_id: params.get('category_id') || '',
      state_id: params.get('state_id') || '',
      city_id: params.get('city_id') || '',
      area_id: params.get('area_id') || '',
      bhk: params.get('bhk') || '',
      partner_id: params.get('partner_id') || ''
    });
    
    const minP = params.get('minPrice');
    const maxP = params.get('maxPrice');
    if (minP || maxP) {
      setPriceRange([minP ? parseInt(minP) : 50000, maxP ? parseInt(maxP) : 50000000]);
    }
  }, [location.search]);

  // Fetch initial data
  useEffect(() => {
    Promise.all([
      api.get('/categories'), 
      api.get('/states'),
      api.get('/partners')
    ]).then(([catRes, stateRes, partnerRes]) => {
      setCategories(catRes.data.data || []);
      setStates(stateRes.data.data || []);
      setPartners(partnerRes.data.data || []);
    }).catch(err => console.error(err));
  }, []);

  // Fetch cascading data
  useEffect(() => {
    if (filters.state_id) {
      api.get(`/cities/${filters.state_id}`).then(res => setCities(res.data.data || []));
    } else { 
      setCities([]); 
      setAreas([]); 
    }
  }, [filters.state_id]);

  useEffect(() => {
    if (filters.city_id) {
      api.get(`/areas/${filters.city_id}`).then(res => setAreas(res.data.data || []));
    } else { 
      setAreas([]); 
    }
  }, [filters.city_id]);

  const handleApply = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    // Preserve existing sort parameter if it exists
    const currentParams = new URLSearchParams(location.search);
    if (currentParams.get('sort')) {
      params.append('sort', currentParams.get('sort'));
    }

    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });
    
    if (priceRange[0] > 50000) params.append('minPrice', priceRange[0]);
    if (priceRange[1] < 50000000) params.append('maxPrice', priceRange[1]);
    
    let basePath = '/properties';
    if (location.pathname === '/bank-auction' && filters.listing_type === 'auction') basePath = '/bank-auction';
    if (location.pathname === '/pre-leased' && filters.listing_type === 'preleased') basePath = '/pre-leased';
    
    if (onClose) onClose();
    navigate(`${basePath}?${params.toString()}`);
  };

  const handleReset = () => {
    const isAuction = location.pathname === '/bank-auction';
    const isPreLeased = location.pathname === '/pre-leased';
    
    setFilters({ 
      listing_type: isAuction ? 'auction' : (isPreLeased ? 'preleased' : ''), 
      category_id: '', state_id: '', city_id: '', area_id: '', bhk: '', partner_id: '' 
    });
    setPriceRange([50000, 50000000]);
    
    if (onClose) onClose();
    
    if (isAuction) navigate('/bank-auction?listing_type=auction');
    else if (isPreLeased) navigate('/pre-leased?listing_type=preleased');
    else navigate('/properties');
  };

  const FormGroup = ({ label, children }) => (
    <div className="mb-6">
      <label className="block text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
        {label}
      </label>
      {children}
    </div>
  );

  const selectClasses = "w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-[15px] font-medium text-[var(--color-text-primary)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all disabled:opacity-50 appearance-none";

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-[var(--color-border-subtle)] overflow-hidden">
      <div className="p-6 border-b border-[var(--color-border-subtle)] flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center">
          <Filter size={20} className="mr-2 text-[var(--color-primary)]" /> 
          Filters
        </h2>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-900 transition-colors">
            <X size={24} />
          </button>
        )}
      </div>

      <div className="p-6">
        <form onSubmit={handleApply}>
          <FormGroup label="Listing Type">
            <select value={filters.listing_type} onChange={e => setFilters({...filters, listing_type: e.target.value})} className={selectClasses}>
              <option value="">All Types</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="preleased">Pre-Leased</option>
              <option value="auction">Bank Auction</option>
            </select>
          </FormGroup>

          <FormGroup label="Property Category">
            <select value={filters.category_id} onChange={e => setFilters({...filters, category_id: e.target.value})} className={selectClasses}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormGroup>

          <FormGroup label="State">
            <select value={filters.state_id} onChange={e => setFilters({...filters, state_id: e.target.value, city_id: '', area_id: ''})} className={selectClasses}>
              <option value="">All States</option>
              {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </FormGroup>

          <FormGroup label="City">
            <select value={filters.city_id} onChange={e => setFilters({...filters, city_id: e.target.value, area_id: ''})} disabled={!filters.state_id} className={selectClasses}>
              <option value="">All Cities</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormGroup>

          <FormGroup label="Area / Locality">
            <select value={filters.area_id} onChange={e => setFilters({...filters, area_id: e.target.value})} disabled={!filters.city_id} className={selectClasses}>
              <option value="">All Areas</option>
              {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </FormGroup>

          <FormGroup label="Bedrooms (BHK)">
            <select value={filters.bhk} onChange={e => setFilters({...filters, bhk: e.target.value})} className={selectClasses}>
              <option value="">Any BHK</option>
              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} BHK</option>)}
            </select>
          </FormGroup>
          
          <FormGroup label="Bank Partner (For Auction)">
            <select value={filters.partner_id} onChange={e => setFilters({...filters, partner_id: e.target.value})} className={selectClasses}>
              <option value="">All Banks</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </FormGroup>

          <FormGroup label="Price Range">
            <div className="px-2 pt-2 pb-6">
              <Slider 
                range 
                min={50000} 
                max={50000000} 
                step={100000}
                value={priceRange} 
                onChange={setPriceRange}
                trackStyle={[{ backgroundColor: 'var(--color-primary)' }]}
                handleStyle={[
                  { borderColor: 'var(--color-primary)', backgroundColor: '#fff', width: 20, height: 20, marginTop: -8 }, 
                  { borderColor: 'var(--color-primary)', backgroundColor: '#fff', width: 20, height: 20, marginTop: -8 }
                ]}
                railStyle={{ backgroundColor: 'var(--color-border-subtle)' }}
              />
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl px-3 py-2 text-center text-sm font-semibold text-[var(--color-text-primary)]">
                ₹ {(priceRange[0] / 100000).toFixed(1)}L
              </div>
              <span className="text-gray-400 font-bold">-</span>
              <div className="flex-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] rounded-xl px-3 py-2 text-center text-sm font-semibold text-[var(--color-text-primary)]">
                ₹ {(priceRange[1] / 10000000).toFixed(2)}Cr
              </div>
            </div>
          </FormGroup>

          <div className="pt-4 flex flex-col gap-3">
            <Button type="submit" className="w-full">
              <Search size={18} className="mr-2" /> Apply Filters
            </Button>
            <Button type="button" variant="ghost" onClick={handleReset} className="w-full">
              <RotateCcw size={18} className="mr-2" /> Reset All
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFilterBar;
