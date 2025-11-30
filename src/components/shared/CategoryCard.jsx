import { Link } from 'react-router-dom';
import { ChevronRight, Package } from 'lucide-react';

const CategoryCard = ({ category }) => {
  const imageUrl = category?.imageUrl
    ? `${import.meta.env.VITE_API_BASE_URL}${category.imageUrl}`
    : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop";

  return (
    <Link
      to={`/category/${category?.id}`}
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 block touch-target"
    >
      {/* Background Image */}
      <div className="aspect-category w-full overflow-hidden bg-gradient-to-br from-[var(--color-secondary-sand)] to-[var(--color-neutral-light)]">
        <img
          src={imageUrl}
          alt={category?.name || 'Category'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />

        {/* Egyptian Pattern Overlay */}
        <div className="absolute inset-0 egyptian-pattern opacity-30" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-navy)]/90 via-[var(--color-primary-navy)]/50 to-transparent group-hover:from-[var(--color-primary-navy)]/95 transition-all duration-500" />

        {/* Gold Accent Border on Hover */}
        <div className="absolute inset-0 border-4 border-transparent group-hover:border-[var(--color-primary-gold)]/30 transition-all duration-500 rounded-2xl" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300 font-['Cairo']">
          {category?.name || 'Unnamed Category'}
        </h3>

        {category?.description && (
          <p className="text-gray-200 text-sm mb-3 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {category.description}
          </p>
        )}

        {/* Shop Now Button with Egyptian Styling */}
        <div className="flex items-center text-white font-semibold group-hover:text-[var(--color-primary-gold)] transition-colors duration-300">
          <span className="text-sm md:text-base">Explore Collection</span>
          <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>

      {/* Product Count Badge - Egyptian Gold */}
      {category?.productCount > 0 && (
        <div className="absolute top-4 right-4 bg-[var(--color-primary-gold)]/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border-2 border-white/20">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[var(--color-primary-navy)]" />
            <span className="text-xs font-bold text-[var(--color-primary-navy)]">
              {category.productCount} {category.productCount === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </div>
      )}

      {/* Corner Accent - Egyptian Style */}
      <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[var(--color-primary-teal)]/20 transform -rotate-45 translate-x-[-50%] translate-y-[-50%] group-hover:bg-[var(--color-primary-gold)]/30 transition-colors duration-500" />
      </div>
    </Link>
  );
};

export default CategoryCard;