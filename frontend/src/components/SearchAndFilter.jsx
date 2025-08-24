import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../Hooks/useDebounce';

const SearchAndFilter = ({ plants, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 1500);

  useEffect(() => {
    // Ensure plants is an array before processing
    if (Array.isArray(plants) && plants.length > 0) {
      const uniqueCategories = [...new Set(plants.flatMap(plant => plant.categories || []))];
      setCategories(uniqueCategories);
    } else {
      setCategories([]);
    }
  }, [plants]);

  const filterPlants = useCallback(() => {
    // Ensure plants is an array before filtering
    if (!Array.isArray(plants)) {
      onFilter([]);
      return;
    }

    console.log('🔍 SearchAndFilter - Debug:', {
      searchTerm,
      debouncedSearchTerm,
      debouncedSearchTermType: typeof debouncedSearchTerm,
      selectedCategory,
      plantsCount: plants.length
    });

    let filtered = plants;

    // Ensure debouncedSearchTerm is a string before filtering
    if (debouncedSearchTerm && typeof debouncedSearchTerm === 'string' && debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      console.log('🔍 Filtering with search term:', searchLower);
      
      filtered = filtered.filter(plant =>
        plant.name?.toLowerCase().includes(searchLower) ||
        (plant.categories && plant.categories.some(category =>
          category.toLowerCase().includes(searchLower)
        ))
      );
      
      console.log('🔍 Filtered results count:', filtered.length);
    }

    if (selectedCategory) {
      filtered = filtered.filter(plant =>
        plant.categories && plant.categories.includes(selectedCategory)
      );
    }

    onFilter(filtered);
  }, [debouncedSearchTerm, selectedCategory, plants, onFilter]);

  useEffect(() => {
    filterPlants();
  }, [filterPlants]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search plants by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div className="md:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;
