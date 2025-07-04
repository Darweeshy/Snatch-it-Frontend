import React from 'react';

const Textarea = React.forwardRef(({ name, id, label, placeholder, className = '', error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id || name} className="block text-sm font-medium text-secondary-700 mb-1">{label}</label>}
      <textarea
        name={name}
        id={id || name}
        ref={ref}
        placeholder={placeholder}
        className={`block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${className} ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;