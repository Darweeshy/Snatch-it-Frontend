const Spinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-16 w-16',
  };

  const colors = {
    primary: 'border-primary-500',
    white: 'border-white',
  };

  return (
    <div
      className={`animate-spin rounded-full border-4 border-t-transparent ${sizes[size]} ${colors[color]}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;