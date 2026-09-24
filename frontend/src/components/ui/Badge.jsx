import React from 'react';

const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
    dark: "bg-gray-900 text-white shadow-md",
    outline: "border border-gray-200 text-gray-700 bg-white",
    
    // Custom real estate variants
    sale: "bg-blue-500 text-white shadow-md",
    rent: "bg-green-500 text-white shadow-md",
    preleased: "bg-purple-500 text-white shadow-md",
    auction: "bg-orange-500 text-white shadow-md",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-widest ${variants[variant] || variants.primary} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
