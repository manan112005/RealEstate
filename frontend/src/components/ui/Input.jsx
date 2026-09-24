import React, { useState } from 'react';

const Input = React.forwardRef(({ 
  label, 
  id, 
  error, 
  className = '', 
  type = 'text',
  icon: Icon,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`mb-4 w-full ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5 transition-colors"
          style={{ color: isFocused ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={18} className="text-gray-400" />
          </div>
        )}
        <input
          id={id}
          ref={ref}
          type={type}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          className={`
            block w-full rounded-xl border bg-[var(--color-bg-primary)] px-4 py-3 text-[var(--color-text-primary)]
            transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]
            placeholder:text-gray-400
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/20 focus:border-[var(--color-error)]' : 'border-[var(--color-border-subtle)] hover:border-gray-200'}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-[var(--color-error)] animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
