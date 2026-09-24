import { Link } from 'react-router-dom';
import { FiMapPin, FiMaximize } from 'react-icons/fi';

const PropertyCard = ({ property }) => {
  const primaryImage = property.PropertyImages?.find(img => img.is_primary)?.cloudinary_url || 
                       property.PropertyImages?.[0]?.cloudinary_url || 
                       'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <Link to={`/properties/${property.id}`} className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={primaryImage} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
          For {property.listing_type}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{property.title}</h3>
        <p className="text-2xl font-extrabold text-blue-600 mb-4">₹{Number(property.price).toLocaleString('en-IN')}</p>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <FiMapPin className="mr-1 flex-shrink-0" />
          <span className="truncate">{property.Area?.name}, {property.City?.name}</span>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-gray-500 text-sm font-medium">
          {property.bhk && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">BHK</span>
              <span>{property.bhk}</span>
            </div>
          )}
          {property.sq_feet && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400 flex items-center"><FiMaximize className="mr-1"/> Sq. Ft.</span>
              <span>{property.sq_feet}</span>
            </div>
          )}
          {property.sq_yard && (
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">Sq. Yd.</span>
              <span>{property.sq_yard}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;

