import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  const imageUrl = category?.imageUrl
    ? `${import.meta.env.VITE_API_BASE_URL}${category.imageUrl}`
    : "";

  return (
    <Link
      to={`/category/${category?.id}`}
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 block"
    >
      {/* Background Image */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category?.name || 'Category'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-sm">No Image</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-500" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
          {category?.name || 'Unnamed Category'}
        </h3>

        {category?.description && (
          <p className="text-gray-200 text-sm mb-3 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {category.description}
          </p>
        )}

        {/* Shop Now Button */}
        <div className="flex items-center text-white font-semibold group-hover:text-[#EF8354] transition-colors duration-300">
          <span>Shop Now</span>
          <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>

      {/* Product Count Badge (if available) */}
      {category?.productCount > 0 && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
          <span className="text-xs font-bold text-gray-900">
            {category.productCount} {category.productCount === 1 ? 'Item' : 'Items'}
          </span>
        </div>
      )}
    </Link>
  );
};

export default CategoryCard;