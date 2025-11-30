import React from 'react';

const Input = React.forwardRef(({ type = 'text', name, id, label, placeholder, className = '', error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id || name} className="block text-sm font-medium text-secondary-700 mb-1">{label}</label>}
      <input
        type={type}
        name={name}
        id={id || name}
        ref={ref}
        placeholder={placeholder}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;