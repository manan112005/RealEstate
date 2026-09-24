import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import PropertyCard from '../ui/PropertyCard';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const NewProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/properties/latest?limit=6').then(res => {
      setProperties(res.data.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-[var(--color-bg-secondary)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-[42px] font-bold text-[var(--color-text-primary)] mb-4 tracking-tight leading-tight">Featured Properties</h2>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">Explore our curated selection of exclusive luxury estates and commercial spaces.</p>
          </div>
          <Link to="/properties" className="inline-flex items-center text-[var(--color-primary)] font-semibold hover:text-[var(--color-primary-hover)] transition-colors group text-lg pb-2">
            View All Collection 
            <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[450px] bg-white rounded-[16px] animate-pulse shadow-soft border border-[var(--color-border-subtle)]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {properties.map((property, index) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewProperties;

