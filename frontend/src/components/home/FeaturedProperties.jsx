import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import PropertyCard from '../ui/PropertyCard';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import { ArrowRight } from 'lucide-react';

const FeaturedProperties = () => {
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
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <SectionHeading 
            title="Featured Properties" 
            subtitle="Handpicked premium properties matching your refined taste."
            centered={false}
            className="!mb-0"
          />
          <Link to="/properties" className="shrink-0 pb-2">
            <Button variant="ghost" className="text-[var(--color-primary)] font-bold text-lg group">
              View All Collection 
              <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[450px] bg-white rounded-xl animate-pulse shadow-soft border border-[var(--color-border-subtle)]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
