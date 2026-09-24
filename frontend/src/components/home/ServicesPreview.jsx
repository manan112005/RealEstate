import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';

const ServicesPreview = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/services').then(res => {
      // Get first 4 services
      setServices(res.data.data?.slice(0, 4) || []);
    }).catch(console.error);
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-normal text-black capitalize"
            style={{ fontFamily: "'Satisfy', cursive" }}
          >
            Our Premium Services
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
              onClick={() => navigate(`/services`)}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.image_url || 'https://via.placeholder.com/400x300'} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-3">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default ServicesPreview;

