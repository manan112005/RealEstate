import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const CtaBanner = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[#1D6FA5] opacity-95" />
      
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-[var(--color-secondary)] opacity-10 rounded-full blur-3xl"></div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 md:p-16 text-center shadow-hover"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Have a Property to Sell or Rent?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            List your property with HomeSpace and get access to thousands of potential buyers and tenants across Gujarat.
          </p>
          
          <Link to="/contact">
            <Button 
              size="lg" 
              className="bg-[var(--color-secondary)] hover:bg-[#b5952f] text-white border-none text-lg px-10 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Contact Us Today
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaBanner;
