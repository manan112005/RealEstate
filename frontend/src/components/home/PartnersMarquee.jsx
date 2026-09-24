import { useState, useEffect } from 'react';
import api from '../../services/api';

const PartnersMarquee = () => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    api.get('/partners').then(res => {
      setPartners(res.data.data || []);
    }).catch(console.error);
  }, []);

  if (!partners.length) return null;

  const PartnerCard = ({ partner }) => (
    <div className="mx-6 md:mx-10 flex flex-col items-center w-40 md:w-48 group-hover:opacity-100 transition-all duration-300 hover:!scale-110 grayscale hover:grayscale-0 cursor-pointer">
      <div className="w-full aspect-[3/2] bg-white flex items-center justify-center p-6 mb-4 rounded-xl shadow-soft border border-[var(--color-border-subtle)]">
        <img 
          src={partner.logo_cloudinary_url || 'https://via.placeholder.com/150'} 
          alt={partner.name} 
          className="max-h-full max-w-full object-contain"
        />
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-white border-y border-[var(--color-border-subtle)] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
            Our Bank Partners
          </h2>
        </div>
      </div>
        
      {/* Seamless Marquee Container */}
      <div className="flex overflow-hidden group py-4">
        <div className="flex shrink-0 animate-marquee min-w-full justify-around group-hover:[animation-play-state:paused]">
          {partners.map(partner => <PartnerCard key={partner.id} partner={partner} />)}
        </div>
        <div className="flex shrink-0 animate-marquee min-w-full justify-around group-hover:[animation-play-state:paused]" aria-hidden="true">
          {partners.map(partner => <PartnerCard key={`${partner.id}-dup`} partner={partner} />)}
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
