import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';

const HomeServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services').then(res => {
      // Limit to 3 or 4 for the home page
      setServices((res.data.data || []).slice(0, 3));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return null; // or skeleton
  if (!services.length) return null;

  return (
    <section className="py-24 bg-white relative">
      <div className="absolute top-0 inset-x-0 h-1/2 bg-[var(--color-bg-secondary)] rounded-b-[100px]" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading 
          title="Our Premium Services" 
          subtitle="Comprehensive real estate solutions designed to maximize your value and minimize your stress."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card hover padding="p-0" className="h-full flex flex-col">
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={service.image_url || 'https://placehold.co/600x400/ececec/999999?text=Service'} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">{service.title}</h3>
                  <div 
                    className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed line-clamp-4 flex-1"
                    dangerouslySetInnerHTML={{ __html: service.description }}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeServices;
