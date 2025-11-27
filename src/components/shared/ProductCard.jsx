import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductCard = ({ product }) => {
  const imageUrl = product?.imageUrl
    ? `${import.meta.env.VITE_API_BASE_URL}${product.imageUrl}`
    : "";

  const isNew = product?.releaseDate &&
    new Date(product.releaseDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const onSale = product?.salePrice && product.salePrice < product.basePrice;

  return (
    <Card className="group overflow-hidden hover-lift">
      <Link to={`/product/${product?.id}`} className="block relative">
        {/* Image Container */}
        <div className="aspect-square w-full bg-gray-100 overflow-hidden relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="text-sm">No Image</span>
            </div>
          )}

          {/* Badges */}
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

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Add to wishlist logic
              }}
              aria-label="Add to wishlist"
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </button>
            <button
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Quick view logic
              }}
              aria-label="Quick view"
            >
              <Eye className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Quick Add to Cart Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="w-full py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart logic
              }}
            >
              Quick Add
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">{product?.brand}</p>
          <h3 className="text-base font-semibold text-gray-900 mt-1 truncate group-hover:text-[#EF8354] transition-colors">
            {product?.name}
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
                {product?.basePrice != null ? formatCurrency(product.basePrice) : 'Unavailable'}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product?.stockQuantity !== undefined && (
            <div className="mt-2">
              {product.stockQuantity > 0 ? (
                <span className="text-xs text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-xs text-red-600 font-medium">Out of Stock</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
};

export default ProductCard;