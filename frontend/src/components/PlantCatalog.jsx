"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import PlantCard from "./PlantCard";
import SearchAndFilter from "./SearchAndFilter";
import { fetchPlants } from "../Redux/plantsSlice";
import { Plus, Loader2, AlertCircle, Leaf } from "lucide-react";

const PlantCatalog = () => {
  const [filteredPlants, setFilteredPlants] = useState([]);
  const dispatch = useDispatch();
  const { plants, loading, error } = useSelector((state) => state.plants);
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  console.log("this is plant catalog", isAuthenticated, role);

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
      <div className="flex flex-col justify-center items-center h-64 animate-fade-in-up">
        <Loader2 className="animate-spin h-12 w-12 text-primary mb-4" />
        <p className="text-muted-foreground">Loading amazing plants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button
          onClick={() => dispatch(fetchPlants())}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-secondary transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Ensure we have plants data before rendering
  if (!Array.isArray(plants) || plants.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="bg-muted/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Leaf className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Plant Catalog
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          No plants available at the moment.
        </p>
        {isAuthenticated && role === "admin" && (
          <Link
            to="/admin/add-plant"
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-secondary transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Plant</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Plant Catalog
          </h1>
          <p className="text-muted-foreground">
            Discover {plants.length} beautiful plants for your space
          </p>
        </div>
        {isAuthenticated && role === "admin" && (
          <Link
            to="/admin/add-plant"
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-secondary transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Plant</span>
          </Link>
        )}
      </div>

      <SearchAndFilter plants={plants} onFilter={handleSearchAndFilter} />

      {filteredPlants.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-muted/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No plants found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredPlants.map((plant, index) => (
            <div key={plant._id} style={{ animationDelay: `${index * 0.1}s` }}>
              <PlantCard plant={plant} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlantCatalog;
