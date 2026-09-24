import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus:ring-[var(--color-primary)] shadow-sm hover:shadow-md",
    secondary: "bg-white text-[var(--color-primary)] border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white focus:ring-[var(--color-primary)]",
    outline: "bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-primary)] focus:ring-[var(--color-border-subtle)]",
    ghost: "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-primary)] focus:ring-[var(--color-border-subtle)]",
    white: "bg-white text-[var(--color-primary)] hover:bg-gray-100 focus:ring-white shadow-xl",
    custom: ""
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const radiusClass = "rounded-xl";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${radiusClass} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
