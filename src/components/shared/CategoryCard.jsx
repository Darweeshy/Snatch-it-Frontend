import { Link } from 'react-router-dom';
import Card from '../ui/Card';

const CategoryCard = ({ category }) => {
  // FIX: The backend now provides the full path. We only need to prepend the base URL.
  const imageUrl = category?.imageUrl
    ? `${import.meta.env.VITE_API_BASE_URL}${category.imageUrl}`
    : "";

  return (
    <Card>
      <Link to={`/category/${category?.id}`} className="block group">
        <div className="aspect-square w-full bg-secondary-100 overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={category.name} 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-secondary-400">
              <span className="text-sm">No Image</span>
            </div>
          )}
        </div>
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-secondary-800">{category?.name}</h3>
        </div>
      </Link>
    </Card>
  );
};

export default CategoryCard;