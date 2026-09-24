import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Square, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from './Badge';

const PropertyCard = ({ property }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Format price
  const formatPrice = (price) => {
    if (!price) return 'Contact for Price';
    if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹ ${(price / 100000).toFixed(2)} Lac`;
    return `₹ ${price.toLocaleString('en-IN')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-xl overflow-hidden shadow-soft transition-all duration-500 hover:shadow-hover hover:-translate-y-1 group border border-[var(--color-border-subtle)]"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <Link to={`/properties/${property.id}`} className="block w-full h-full">
          <img 
            src={
              property.PropertyImages?.[0]?.cloudinary_url || 
              property.images?.[0]?.image_url || 
              'https://placehold.co/600x400/ececec/999999?text=No+Photo+Available'
            } 
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
        </Link>
        
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {property.listing_type && (
            <Badge variant={property.listing_type.toLowerCase()}>
              {property.listing_type.toLowerCase() === 'sale' ? 'For Sale' : 
               property.listing_type.toLowerCase() === 'rent' ? 'For Rent' :
               property.listing_type.toLowerCase() === 'preleased' ? 'Pre-Leased' :
               property.listing_type.toLowerCase() === 'auction' ? 'Bank Auction' : 
               property.listing_type}
            </Badge>
          )}
          {property.is_featured && <Badge variant="dark">Premium</Badge>}
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors z-10 focus:outline-none"
        >
          <Heart size={20} className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4">
           <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg font-bold text-[var(--color-text-primary)] shadow-sm text-lg">
             {formatPrice(property.price)}
           </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5">
        <Link to={`/properties/${property.id}`} className="block">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1 truncate group-hover:text-[var(--color-primary)] transition-colors">
            {property.title}
          </h3>
        </Link>
        
        <div className="flex items-center text-[var(--color-text-secondary)] text-sm mb-4 mt-1">
          <MapPin size={14} className="mr-1.5 shrink-0" />
          <span className="truncate">
            {[property.Area?.name, property.City?.name, property.State?.name].filter(Boolean).join(', ') || 'Location not specified'}
          </span>
        </div>

        {/* Key Metrics */}
        <div className="flex items-center gap-4 py-3 border-t border-[var(--color-border-subtle)] mb-4">
          {property.bhk && (
            <div className="flex items-center text-[var(--color-text-secondary)] text-sm font-medium">
              <BedDouble size={16} className="mr-1.5 text-[var(--color-primary)]" />
              {property.bhk} BHK
            </div>
          )}
          {property.sq_feet && (
            <div className="flex items-center text-[var(--color-text-secondary)] text-sm font-medium">
              <Square size={16} className="mr-1.5 text-[var(--color-primary)]" />
              {property.sq_feet} Sq.Ft
            </div>
          )}
        </div>

        {/* Pre-Leased Investment Metrics (Graceful Degradation) */}
        {property.listing_type === 'preleased' && (property.rental_yield || property.monthly_rent || property.tenant_type) && (
          <div className="flex items-center gap-4 py-2 px-3 mb-4 bg-purple-50 rounded-lg border border-purple-100 shrink-0 overflow-hidden">
            {property.rental_yield && (
              <div className="text-[12px] font-bold text-purple-800">
                <span className="text-purple-500 block text-[10px] uppercase tracking-wide">ROI</span>
                {property.rental_yield}%
              </div>
            )}
            {property.monthly_rent && (
              <div className={`text-[12px] font-bold text-purple-800 ${property.rental_yield ? 'border-l border-purple-200 pl-4' : ''}`}>
                <span className="text-purple-500 block text-[10px] uppercase tracking-wide">Rent</span>
                ₹{property.monthly_rent}/mo
              </div>
            )}
            {property.tenant_type && (
              <div className={`text-[12px] font-bold text-purple-800 truncate ${property.rental_yield || property.monthly_rent ? 'border-l border-purple-200 pl-4' : ''}`}>
                <span className="text-purple-500 block text-[10px] uppercase tracking-wide">Tenant</span>
                {property.tenant_type}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            {property.listing_type === 'auction' && property.Partner ? (
              <>
                <div className="w-8 h-8 rounded-full bg-white border border-[var(--color-border-subtle)] p-1 overflow-hidden mr-2">
                  <img 
                    src={property.Partner.logo_cloudinary_url || `https://ui-avatars.com/api/?name=${property.Partner.name}&background=fff&color=000`} 
                    alt={property.Partner.name} 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <span className="text-[13px] text-[var(--color-text-primary)] font-bold truncate max-w-[120px]" title={property.Partner.name}>
                  {property.Partner.name}
                </span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden mr-2">
                  <img src="https://ui-avatars.com/api/?name=Expert&background=0F4C81&color=fff" alt="Agent" className="w-full h-full object-cover" />
                </div>
                <span className="text-[13px] text-[var(--color-text-secondary)] font-medium">HomeSpace Expert</span>
              </>
            )}
          </div>
          <Link to={`/properties/${property.id}`} className="text-[var(--color-primary)] font-bold text-[13px] hover:underline uppercase tracking-wide">
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
