"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "../Hooks/useDebounce";
import { Search, Filter, X } from "lucide-react";

const SearchAndFilter = ({ plants, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 1500);

  useEffect(() => {
    // Ensure plants is an array before processing
    if (Array.isArray(plants) && plants.length > 0) {
      const uniqueCategories = [
        ...new Set(plants.flatMap((plant) => plant.categories || [])),
      ];
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

    console.log("🔍 SearchAndFilter - Debug:", {
      searchTerm,
      debouncedSearchTerm,
      debouncedSearchTermType: typeof debouncedSearchTerm,
      selectedCategory,
      plantsCount: plants.length,
    });

    let filtered = plants;

    // Ensure debouncedSearchTerm is a string before filtering
    if (
      debouncedSearchTerm &&
      typeof debouncedSearchTerm === "string" &&
      debouncedSearchTerm.trim()
    ) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      console.log("🔍 Filtering with search term:", searchLower);

      filtered = filtered.filter(
        (plant) =>
          plant.name?.toLowerCase().includes(searchLower) ||
          (plant.categories &&
            plant.categories.some((category) =>
              category.toLowerCase().includes(searchLower)
            ))
      );

      console.log("🔍 Filtered results count:", filtered.length);
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (plant) =>
          plant.categories && plant.categories.includes(selectedCategory)
      );
    }

    onFilter(filtered);
  }, [debouncedSearchTerm, selectedCategory, plants, onFilter]);

  useEffect(() => {
    filterPlants();
  }, [filterPlants]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setIsFilterOpen(false);
  };

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border animate-fade-in-up">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search plants by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="lg:hidden flex items-center justify-center space-x-2 bg-primary text-primary-foreground px-4 py-3 rounded-xl hover:bg-secondary transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>

        {/* Category Filter */}
        <div
          className={`lg:block ${isFilterOpen ? "block" : "hidden"} lg:w-64`}
        >
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 text-foreground appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedCategory) && (
          <button
            onClick={clearFilters}
            className="flex items-center justify-center space-x-2 bg-muted text-muted-foreground px-4 py-3 rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {(searchTerm || selectedCategory) && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchTerm && (
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Search: "{searchTerm}"
            </span>
          )}
          {selectedCategory && (
            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
              Category: {selectedCategory}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
