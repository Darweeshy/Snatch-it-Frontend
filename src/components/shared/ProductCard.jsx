import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductCard = ({ product }) => {
  // Safely construct image URL
  const imageUrl = product?.imageUrl
    ? `${import.meta.env.VITE_API_BASE_URL}${product.imageUrl}`
    : "";

  // Check if product is new (within last 30 days)
  const isNew = product?.releaseDate &&
    new Date(product.releaseDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Safely check for sale (only if salePrice exists and is less than basePrice)
  const onSale = product?.salePrice && product?.basePrice && product.salePrice < product.basePrice;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <Link to={`/product/${product?.id}`} className="block relative">
        {/* Image Container */}
        <div className="aspect-square w-full bg-gray-100 overflow-hidden relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product?.name || 'Product'}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="hidden items-center justify-center h-full text-gray-400 absolute inset-0 bg-gray-100">
            <span className="text-sm">No Image</span>
          </div>

          {/* Badges */}
          {(isNew || onSale) && (
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isNew && (
                <span className="px-3 py-1 bg-gradient-to-r from-[#10B981] to-[#059669] text-white text-xs font-bold rounded-full shadow-lg">
                  NEW
                </span>
              )}
              {onSale && (
                <span className="px-3 py-1 bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white text-xs font-bold rounded-full shadow-lg">
                  SALE
                </span>
              )}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {product?.brand && (
            <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
              {product.brand}
            </p>
          )}
          <h3 className="text-base font-semibold text-gray-900 mt-1 truncate group-hover:text-[#EF8354] transition-colors">
            {product?.name || 'Unnamed Product'}
          </h3>

          {/* Price */}
          <div className="mt-3 flex items-center gap-2">
            {onSale ? (
              <>
                <span className="text-lg font-bold text-[#EF8354]">
                  {formatCurrency(product.salePrice)}
                </span>
                <span className="text-sm line-through text-gray-400">
                  {formatCurrency(product.basePrice)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                {product?.basePrice != null ? formatCurrency(product.basePrice) : 'Price unavailable'}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ProductCard;