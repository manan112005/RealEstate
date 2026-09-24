import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Building2, Key, Landmark, Map, Tent, Grid, TrendingUp, CircleDollarSign } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const categories = [
  { name: 'Residential', icon: Home, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Commercial', icon: Building2, color: 'text-orange-500', bg: 'bg-orange-50' },
  { name: 'Pre Leased', icon: Key, color: 'text-green-500', bg: 'bg-green-50' },
  { name: 'Bank Auction', icon: Landmark, color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Land', icon: Map, color: 'text-amber-500', bg: 'bg-amber-50' },
  { name: 'Farm House', icon: Tent, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Plots', icon: Grid, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { name: 'Investments', icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Loan', icon: CircleDollarSign, color: 'text-cyan-500', bg: 'bg-cyan-50' },
];

const BrowseByCategory = () => {
  return (
    <section className="py-24 bg-[var(--color-bg-primary)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Browse By Category" 
          subtitle="Explore our wide range of property categories tailored to your specific needs."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link 
                  to={`/properties?type=${encodeURIComponent(cat.name)}`}
                  className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-soft hover:shadow-hover border border-[var(--color-border-subtle)] transition-all duration-300 hover:-translate-y-1 group h-full"
                >
                  <div className={`w-16 h-16 rounded-full ${cat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className={cat.color} />
                  </div>
                  <h3 className="text-[15px] font-bold text-[var(--color-text-primary)] text-center group-hover:text-[var(--color-primary)] transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrowseByCategory;
