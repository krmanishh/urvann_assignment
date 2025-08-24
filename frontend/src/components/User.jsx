import { Link } from 'react-router-dom';

const User = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/catalog"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">🌿</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Browse Plants</h3>
          <p className="text-gray-600">Explore our plant collection</p>
        </Link>
        
        <Link
          to="/cart"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">View Cart</h3>
          <p className="text-gray-600">Check your shopping cart</p>
        </Link>
        
        <Link
          to="/profile"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Profile</h3>
          <p className="text-gray-600">Manage your account</p>
        </Link>
      </div>
    </div>
  );
};

export default User;
