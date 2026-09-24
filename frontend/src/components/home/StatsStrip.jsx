import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const StatsStrip = () => {
  const [stats, setStats] = useState({
    properties: '500+',
    clients: '1,200+',
    cities: '15+',
    experience: '10+'
  });

  useEffect(() => {
    // Attempt to fetch real stats if the endpoint exists
    api.get('/dashboard/stats').then(res => {
      const data = res.data.data;
      if (data) {
        setStats({
          properties: data.totalProperties || '500+',
          clients: data.totalPartners || '1,200+', // Using partners as proxy if clients isn't available
          cities: data.totalLocations || '15+',
          experience: '10+' // Usually static for a company unless calculated from founding date
        });
      }
    }).catch(() => {
      // Endpoint might not exist or be protected, fallback to placeholders
      console.log('Using placeholder stats');
    });
  }, []);

  const statItems = [
    { label: 'Total Properties', value: stats.properties },
    { label: 'Happy Clients', value: stats.clients },
    { label: 'Cities Covered', value: stats.cities },
    { label: 'Years of Experience', value: stats.experience },
  ];

  return (
    <section className="py-20 bg-[var(--color-primary)] relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-white/20">
          {statItems.map((item, idx) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`text-center ${idx % 2 === 0 ? 'border-none md:border-solid' : 'border-none'} ${idx === 0 ? 'border-none' : ''}`}
            >
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">
                {item.value}
              </div>
              <div className="text-[var(--color-secondary)] font-bold text-sm md:text-base uppercase tracking-wider">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
