```javascript
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatCurrency';
import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  // Safely construct image URL
  const imageUrl = product?.imageUrl
    ? `${ import.meta.env.VITE_API_BASE_URL }${ product.imageUrl } `
    : "";

  // Check if product is new (within last 30 days)
  const isNew = product?.releaseDate &&
    new Date(product.releaseDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Safely check for sale (only if salePrice exists and is less than basePrice)
  const onSale = product?.salePrice && product?.basePrice && product.salePrice < product.basePrice;

  return (
    <Card className="group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-none bg-white">
      <Link to={`/ product / ${ product?.id } `} className="block relative">
        {/* Image Container */}
        <div className="aspect-[4/5] w-full bg-secondary-50 overflow-hidden relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product?.name || 'Product'}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="hidden items-center justify-center h-full text-secondary-400 absolute inset-0 bg-secondary-50">
            <span className="text-sm font-medium">No Image</span>
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Actions */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 px-4">
            <button className="p-2 bg-white text-primary-navy rounded-full shadow-lg hover:bg-primary-gold hover:text-white transition-colors" title="Quick View">
              <Eye size={18} />
            </button>
            <button className="p-2 bg-primary-navy text-white rounded-full shadow-lg hover:bg-primary-gold transition-colors" title="Add to Cart">
              <ShoppingCart size={18} />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <span className="px-3 py-1 bg-primary-teal text-white text-xs font-bold tracking-wider uppercase shadow-md">
                New
              </span>
            )}
            {onSale && (
              <span className="px-3 py-1 bg-secondary-terracotta text-white text-xs font-bold tracking-wider uppercase shadow-md">
                Sale
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 text-center">
          {product?.brand && (
            <p className="text-xs uppercase tracking-widest text-secondary-500 font-medium mb-1">
              {product.brand}
            </p>
          )}
          <h3 className="text-base font-bold text-primary-navy truncate font-cairo group-hover:text-primary-gold transition-colors">
            {product?.name || 'Unnamed Product'}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-center justify-center gap-2">
            {onSale ? (
              <>
                <span className="text-lg font-bold text-secondary-terracotta">
                  {formatCurrency(product.salePrice)}
                </span>
                <span className="text-sm line-through text-secondary-400">
                  {formatCurrency(product.basePrice)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary-navy">
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
```