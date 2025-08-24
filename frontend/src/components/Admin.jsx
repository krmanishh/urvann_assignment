import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/add-plant"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Add New Plant</h3>
          <p className="text-gray-600">Add new plants to the catalog</p>
        </Link>
        
        <Link
          to="/admin/dashboard"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">View Analytics</h3>
          <p className="text-gray-600">View sales and inventory analytics</p>
        </Link>
        
        <Link
          to="/catalog"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Plants</h3>
          <p className="text-gray-600">View and manage existing plants</p>
        </Link>
      </div>
    </div>
  );
};

export default Admin;
