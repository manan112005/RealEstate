import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import PropertyCard from '../../components/ui/PropertyCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import SectionHeading from '../../components/ui/SectionHeading';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { 
  MapPin, Settings, Tag, DollarSign, Building, Calendar, 
  Car, Home, Wrench, Share2, Heart, ArrowLeft, Phone, Mail, Send 
} from 'lucide-react';

const PropertyDetail = () => {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [inquiryStatus, setInquiryStatus] = useState(null);
  const [inquiryError, setInquiryError] = useState('');

  useEffect(() => {
    const fetchPropertyAndSimilar = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/properties/${slug}`);
        const currentProperty = data.data;
        setProperty(currentProperty);

        if (currentProperty) {
          try {
            const params = new URLSearchParams();
            if (currentProperty.city_id) params.append('city_id', currentProperty.city_id);
            if (currentProperty.property_type_id) params.append('property_type_id', currentProperty.property_type_id);
            params.append('limit', '4');

            const similarRes = await api.get(`/properties?${params.toString()}`);
            setSimilarProperties(similarRes.data.data?.filter(p => p.id !== currentProperty.id).slice(0, 3) || []);
          } catch (similarErr) {
            console.warn('Could not fetch similar properties:', similarErr);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyAndSimilar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setInquiryStatus(null);
    setInquiryError('');
    setInquiryForm({ name: '', phone: '', email: '', message: '' });
  }, [slug]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryStatus('sending');
    setInquiryError('');
    try {
      // POST to /contact endpoint with property context
      await api.post('/contact', {
        name: inquiryForm.name,
        phone: inquiryForm.phone,
        email: inquiryForm.email,
        message: inquiryForm.message,
        subject: `Inquiry for ${property?.title || 'Property'} (ID: ${property?.id})`
      });
      setInquiryStatus('success');
      setInquiryForm({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      console.error('Inquiry failed:', err);
      setInquiryStatus('error');
      setInquiryError(err.response?.data?.message || 'Failed to submit inquiry. Please check your details and try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)] pt-32 px-4 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-[var(--color-primary)] border-[var(--color-border-subtle)] rounded-full animate-spin mb-4"></div>
          <div className="text-xl font-bold text-[var(--color-text-secondary)]">Loading premium property...</div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-secondary)] pt-32 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <Tag size={40} className="text-red-500" />
        </div>
        <h2 className="text-4xl font-extrabold text-[var(--color-text-primary)] mb-4">Property Not Found</h2>
        <p className="text-[var(--color-text-secondary)] text-lg max-w-md mb-8">{error || "This exclusive listing may have been sold or is no longer available."}</p>
        <Link to="/properties">
          <Button size="lg"><ArrowLeft size={20} className="mr-2" /> Back to Properties</Button>
        </Link>
      </div>
    );
  }

  const images = property.PropertyImages?.length > 0 
    ? property.PropertyImages.map(img => img.cloudinary_url)
    : [property.images?.[0]?.image_url || 'https://placehold.co/1200x800/ececec/999999?text=No+Photo+Available'];

  const formatPrice = (price) => {
    if (!price) return 'Contact for Price';
    return `₹ ${Number(price).toLocaleString('en-IN') || price}`;
  };

  const SpecItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors">
      <div className="p-3 bg-[var(--color-primary)]/10 rounded-lg shrink-0">
        <Icon size={24} className="text-[var(--color-primary)]" />
      </div>
      <div>
        <div className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">{label}</div>
        <div className="text-[15px] font-semibold text-[var(--color-text-primary)]">{value || 'N/A'}</div>
      </div>
    </div>
  );

  return (
    <div className="bg-[var(--color-bg-secondary)] min-h-screen pb-24 pt-24 font-sans">
      <SEO 
        title={`${property.title || 'Property'} | HomeSpace`} 
        description={String(property.description || property.title || '').substring(0, 160)} 
        image={images[0]} 
      />
      
      {/* Top Gallery Section */}
      <div className="w-full bg-black h-[50vh] md:h-[65vh] relative group">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="w-full h-full"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <img src={img} alt={`${property.title} - view ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Floating Actions on Gallery */}
        <div className="absolute top-6 right-6 z-20 flex gap-3">
          <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-[var(--color-text-primary)] transition-colors shadow-sm">
            <Share2 size={20} />
          </button>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-sm"
          >
            <Heart size={20} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-white'} />
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-30">
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Content (Left 2/3) */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Title & Key Info Card */}
            <Card padding="p-8 md:p-10">
              <div className="flex flex-wrap gap-3 mb-6">
                {property.listing_type && (
                  <Badge variant={property.listing_type.toLowerCase()}>
                    {property.listing_type.toLowerCase() === 'sale' ? 'For Sale' : 
                     property.listing_type.toLowerCase() === 'rent' ? 'For Rent' :
                     property.listing_type.toLowerCase() === 'preleased' ? 'Pre-Leased' :
                     property.listing_type.toLowerCase() === 'auction' ? 'Bank Auction' : 
                     property.listing_type}
                  </Badge>
                )}
                <Badge variant="outline">{property.Category?.name || property.PropertyType?.PropertyCategory?.name || property.PropertyType?.name || 'Exclusive'}</Badge>
              </div>

              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8 border-b border-[var(--color-border-subtle)] pb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] mb-3 leading-tight">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-[var(--color-text-secondary)] text-[15px] font-medium">
                    <MapPin size={18} className="mr-2 text-[var(--color-primary)] shrink-0" />
                    {[property.flat_no, property.address_line_1, property.Area?.name, property.City?.name, property.State?.name].filter(Boolean).join(', ')}
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-3xl font-extrabold text-[var(--color-secondary)] mb-1">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-[13px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                    + Govt. Charges & Tax
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Property Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <SpecItem 
                  icon={Building} 
                  label="Configuration" 
                  value={`${property.bhk ? property.bhk + ' BHK' : ''} ${property.bathrooms ? '| ' + property.bathrooms + ' Bath' : ''}`} 
                />
                <SpecItem 
                  icon={Settings} 
                  label="Area" 
                  value={`${property.sq_feet ? property.sq_feet + ' Sq.Ft' : property.sq_yard ? property.sq_yard + ' Sq.Yard' : ''}`} 
                />
                <SpecItem icon={Home} label="Furnishing" value={property.furnishing_status} />
                <SpecItem icon={Car} label="Parking" value={property.covered_parking ? `${property.covered_parking} Covered` : property.open_parking ? `${property.open_parking} Open` : 'None'} />
                <SpecItem icon={Wrench} label="Construction" value={property.construction_status} />
                <SpecItem icon={Calendar} label="Age of Property" value={property.age_of_property} />
              </div>
            </Card>

            {/* Description Card */}
            <Card padding="p-8 md:p-10">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">About this Property</h3>
              <div className="prose prose-lg text-[var(--color-text-secondary)] leading-relaxed max-w-none">
                {property.description ? (
                  <div dangerouslySetInnerHTML={{ __html: String(property.description).replace(/\n/g, '<br/>') }} />
                ) : (
                  <p>No description provided for this exclusive property.</p>
                )}
              </div>
            </Card>

            {/* Financial Details */}
            <Card padding="p-8 md:p-10">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Financial Details</h3>
              <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 border border-[var(--color-border-subtle)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Maintenance Charge</div>
                    <div className="text-[16px] font-semibold text-[var(--color-text-primary)] flex items-center">
                      <DollarSign size={16} className="text-gray-400 mr-1" /> {property.maintenance_charge || 'Not Specified'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Brokerage Charge</div>
                    <div className="text-[16px] font-semibold text-[var(--color-text-primary)]">
                      {property.brokerage_charge ? `₹ ${Number(property.brokerage_charge).toLocaleString('en-IN')} (Extra)` : 'As applicable'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sticky Sidebar (Right 1/3) */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-32 space-y-6">
              
              {/* Agent Contact Card */}
              <Card padding="p-6 md:p-8" className="border-t-4 border-t-[var(--color-primary)]">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--color-border-subtle)]">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden shrink-0">
                    <img src="https://ui-avatars.com/api/?name=HomeSpace+Agent&background=0F4C81&color=fff&size=128" alt="Agent" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)]">HomeSpace Expert</h3>
                    <p className="text-[13px] font-medium text-[var(--color-text-secondary)]">Verified Real Estate Agent</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <a href="tel:+919000000000" className="flex items-center gap-3 text-[15px] font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                      <Phone size={18} className="text-[var(--color-primary)]" />
                    </div>
                    +91 90000 00000
                  </a>
                  <a href="mailto:info@homespace.com" className="flex items-center gap-3 text-[15px] font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                      <Mail size={18} className="text-[var(--color-primary)]" />
                    </div>
                    info@homespace.com
                  </a>
                </div>

                <div className="bg-[var(--color-bg-secondary)] rounded-xl p-5 border border-[var(--color-border-subtle)]">
                  <h4 className="text-[14px] font-bold text-[var(--color-text-primary)] mb-4">Express Interest</h4>
                  
                  {inquiryStatus === 'success' ? (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm font-medium border border-green-200">
                      Thank you! Your inquiry has been sent successfully. Our agent will contact you shortly.
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      {inquiryError && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-medium border border-red-200">
                          {inquiryError}
                        </div>
                      )}

                      <input 
                        type="text" 
                        required
                        placeholder="Your Name *" 
                        className="w-full bg-white border border-[var(--color-border-subtle)] text-[14px] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                        value={inquiryForm.name}
                        onChange={e => setInquiryForm({...inquiryForm, name: e.target.value})}
                      />
                      <input 
                        type="tel" 
                        required
                        placeholder="Phone Number *" 
                        className="w-full bg-white border border-[var(--color-border-subtle)] text-[14px] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                        value={inquiryForm.phone}
                        onChange={e => setInquiryForm({...inquiryForm, phone: e.target.value})}
                      />
                      <input 
                        type="email" 
                        placeholder="Email Address (optional)" 
                        className="w-full bg-white border border-[var(--color-border-subtle)] text-[14px] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                        value={inquiryForm.email}
                        onChange={e => setInquiryForm({...inquiryForm, email: e.target.value})}
                      />
                      <textarea 
                        placeholder="Message / Requirements (optional)" 
                        rows="3"
                        className="w-full bg-white border border-[var(--color-border-subtle)] text-[14px] rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all resize-none"
                        value={inquiryForm.message}
                        onChange={e => setInquiryForm({...inquiryForm, message: e.target.value})}
                      ></textarea>
                      <Button 
                        type="submit" 
                        className="w-full shadow-md"
                        isLoading={inquiryStatus === 'sending'}
                        disabled={inquiryStatus === 'sending'}
                      >
                        <Send size={16} className="mr-2" /> Send Inquiry
                      </Button>
                    </form>
                  )}
                </div>
              </Card>

            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[var(--color-border-subtle)]">
            <SectionHeading 
              title="Similar Properties" 
              subtitle="You might also be interested in these handpicked properties."
              centered={false}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {similarProperties.map((prop, idx) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <PropertyCard property={prop} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PropertyDetail;
