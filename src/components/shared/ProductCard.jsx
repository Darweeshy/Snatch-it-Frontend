import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductCard = ({ product }) => {
  // FIX: The backend provides the full path. We only need to prepend the base URL.
  const imageUrl = product?.imageUrl
    ? `${import.meta.env.VITE_API_BASE_URL}${product.imageUrl}`
    : "";

  return (
    <Card>
      <Link to={`/product/${product?.id}`} className="block group">
        <div className="aspect-square w-full bg-secondary-100 overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-secondary-400">
              <span className="text-sm">No Image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm text-secondary-500">{product?.brand}</p>
          <h3 className="text-base font-semibold text-secondary-800 truncate mt-1">{product?.name}</h3>
          <p className="text-lg font-bold text-secondary-900 mt-2">
            {product?.basePrice != null ? formatCurrency(product.basePrice) : 'Unavailable'}
          </p>
        </div>
      </Link>
    </Card>
  );
};

export default ProductCard;