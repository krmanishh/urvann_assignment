import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addPlant } from '../Redux/plantsSlice';
import { toast } from 'react-hot-toast';

const AdminAddPlant = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    categories: [],
    inStock: true,
    image: null
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // Predefined categories from your backend model - EXACTLY as defined in backend
  const availableCategories = [
    "Indoor",
    "Outdoor", 
    "Succulent",
    "Air Purifying",
    "Home Decor",  // Fixed: was "Home decor", now "Home Decor"
    "Flowering",
    "Medicinal"
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory && !formData.categories.includes(selectedCategory)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, selectedCategory]
      }));
    }
  };

  const removeCategory = (categoryToRemove) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== categoryToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || formData.categories.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const plantData = new FormData();
      plantData.append('name', formData.name);
      plantData.append('price', formData.price);
      plantData.append('description', formData.description);
      plantData.append('inStock', formData.inStock);
      formData.categories.forEach(category => {
        plantData.append('categories', category);
      });
      if (formData.image) {
        plantData.append('image', formData.image);
      }

      await dispatch(addPlant(plantData)).unwrap();
      toast.success('Plant added successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to add plant');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not admin
  if (!isAuthenticated || role !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Add New Plant</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Plant Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter plant name"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter price"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter plant description"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Categories <span className="text-red-500">*</span>
          </label>
          
          {/* Category Dropdown */}
          <select
            name="categorySelect"
            onChange={handleCategoryChange}
            value=""
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
          >
            <option value="">Select a category</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Selected Categories Display */}
          {formData.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.categories.map(category => (
                <span
                  key={category}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-600 hover:bg-green-200 hover:text-green-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-500">
            Selected categories: {formData.categories.length} of {availableCategories.length}
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleInputChange}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            In Stock
          </label>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Plant Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleInputChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {formData.image && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {formData.image.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 font-semibold text-lg"
        >
          {loading ? 'Adding Plant...' : 'Add Plant'}
        </button>
      </form>
    </div>
  );
};

export default AdminAddPlant;
