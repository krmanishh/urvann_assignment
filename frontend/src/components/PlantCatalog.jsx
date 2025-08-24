import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PlantCard from './PlantCard';
import SearchAndFilter from './SearchAndFilter';
import { fetchPlants } from '../Redux/plantsSlice';

const PlantCatalog = () => {
  const [filteredPlants, setFilteredPlants] = useState([]);
  const dispatch = useDispatch();
  const { plants, loading, error } = useSelector((state) => state.plants);
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  console.log("this is plant catalog",isAuthenticated,role);

  useEffect(() => {
    dispatch(fetchPlants());
  }, [dispatch]);

  useEffect(() => {
    // Only update filtered plants when plants data changes and it's an array
    if (Array.isArray(plants)) {
      setFilteredPlants(plants);
    }
  }, [plants]);

  const handleSearchAndFilter = (filtered) => {
    setFilteredPlants(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => dispatch(fetchPlants())}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Ensure we have plants data before rendering
  if (!Array.isArray(plants) || plants.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Plant Catalog</h1>
        <p className="text-gray-600 text-lg">No plants available at the moment.</p>
        {isAuthenticated && role === 'admin' && (
          <div className="mt-4">
            <Link
              to="/admin/add-plant"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add New Plant
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Plant Catalog</h1>
        {isAuthenticated && role === 'admin' && (
          <Link
            to="/admin/add-plant"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add New Plant
          </Link>
        )}
      </div>
      
      <SearchAndFilter plants={plants} onFilter={handleSearchAndFilter} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {filteredPlants.map((plant) => (
          <PlantCard key={plant._id} plant={plant} />
        ))}
      </div>
    </div>
  );
};

export default PlantCatalog;
