"use client";

import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../Redux/cartSlice";
import { toast } from "react-hot-toast";
import { ShoppingCart, Heart, Star } from "lucide-react";

const PlantCard = ({ plant }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      await dispatch(addToCart({ plantId: plant._id, quantity: 1 })).unwrap();
      toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="group bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-scale-in">
      <div className="relative h-56 bg-muted overflow-hidden">
        {plant.imageUrl ? (
          <img
            src={plant.imageUrl || "/placeholder.svg"}
            alt={plant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="text-primary text-6xl">🌱</div>
          </div>
        )}

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors">
          <Heart className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
        </button>

        {/* Stock Badge */}
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
            plant.inStock
              ? "bg-primary/90 text-primary-foreground"
              : "bg-destructive/90 text-destructive-foreground"
          }`}
        >
          {plant.inStock ? "In Stock" : "Out of Stock"}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
            {plant.name}
          </h3>
          <div className="flex items-center space-x-1 text-secondary">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
          {plant.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">
            ${plant.price}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {plant.categories.slice(0, 2).map((category, index) => (
            <span
              key={index}
              className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium"
            >
              {category}
            </span>
          ))}
          {plant.categories.length > 2 && (
            <span className="text-muted-foreground text-xs px-2 py-1">
              +{plant.categories.length - 2} more
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!plant.inStock}
          className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
            plant.inStock
              ? "bg-primary text-primary-foreground hover:bg-secondary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{plant.inStock ? "Add to Cart" : "Out of Stock"}</span>
        </button>
      </div>
    </div>
  );
};

export default PlantCard;
