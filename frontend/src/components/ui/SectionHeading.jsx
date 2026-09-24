import { motion } from 'framer-motion';

const SectionHeading = ({ 
  title, 
  subtitle, 
  centered = true,
  className = ''
}) => {
  return (
    <div className={`mb-16 ${centered ? 'text-center' : 'text-left'} ${className}`}>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4 tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
