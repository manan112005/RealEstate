import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'p-6',
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`bg-white rounded-xl shadow-soft border border-[var(--color-border-subtle)] overflow-hidden ${hover ? 'transition-shadow duration-300 hover:shadow-hover' : ''} ${padding} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
