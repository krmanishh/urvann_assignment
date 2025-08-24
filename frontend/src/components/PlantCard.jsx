import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../Redux/cartSlice';
import { toast } from 'react-hot-toast';

const PlantCard = ({ plant }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await dispatch(addToCart({ plantId: plant._id, quantity: 1 })).unwrap();
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {plant.image ? (
          <img 
            src={plant.image} 
            alt={plant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-4xl">🌱</div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {plant.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {plant.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-green-600 font-bold text-lg">
            ₹{plant.price}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            plant.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {plant.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {plant.categories.map((category, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
            >
              {category}
            </span>
          ))}
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={!plant.inStock}
          className={`w-full py-2 rounded-lg transition-colors ${
            plant.inStock 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {plant.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default PlantCard;
