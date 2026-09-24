import { motion } from 'framer-motion';
import { ShieldCheck, Target, Award } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified Properties',
    description: 'Every property listed undergoes a rigorous legal and physical verification process to ensure absolute peace of mind.'
  },
  {
    icon: Target,
    title: 'Expert Guidance',
    description: 'Our team of seasoned real estate experts provides personalized advice tailored to your specific investment goals.'
  },
  {
    icon: Award,
    title: 'Best Deals Guaranteed',
    description: 'Leveraging our vast network and market knowledge, we negotiate the best possible terms for our clients.'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-[var(--color-bg-secondary)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Why Choose HomeSpace" 
          subtitle="We are committed to delivering excellence, transparency, and unparalleled service in every transaction."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 bg-white rounded-2xl shadow-soft flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--color-primary)] transition-all duration-500">
                  <Icon size={40} className="text-[var(--color-primary)] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">{feature.title}</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
