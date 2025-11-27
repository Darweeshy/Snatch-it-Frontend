// The '...props' here collects any extra attributes like 'form'
const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-200 text-secondary-800 hover:bg-secondary-300 focus:ring-secondary-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-secondary-300 bg-transparent text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-400',
    ghost: 'bg-transparent text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-400',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props} // This line passes down any extra props, like form="checkout-form"
    >
      {children}
    </button>
  );
};

export default Button;