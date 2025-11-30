// The '...props' here collects any extra attributes like 'form'
const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false, ...props }) => {
  // Base styles are now handled by the specific variant classes in main.css
  // We keep some structural defaults just in case, but mostly rely on the classes

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300',
    outline: 'btn-outline',
    ghost: 'bg-transparent text-secondary-700 hover:bg-secondary-100 px-4 py-2 rounded-lg transition-colors',
    gold: 'btn-gold'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${variants[variant] || variants.primary} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;