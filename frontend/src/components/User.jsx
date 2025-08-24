import { Link } from "react-router-dom";
import { Package, ShoppingCart, User, ArrowRight } from "lucide-react";

const UserDashboard = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Welcome to Your Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your plant journey from here
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/catalog"
          className="group bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
            <Package className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors">
            Browse Plants
          </h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Explore our amazing collection of plants and find your perfect green
            companion
          </p>
          <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </Link>

        <Link
          to="/cart"
          className="group bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="bg-secondary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
            <ShoppingCart className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-xl font-semibold text-card-foreground mb-3 group-hover:text-secondary transition-colors">
            Shopping Cart
          </h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Review your selected plants and proceed to checkout when ready
          </p>
          <div className="flex items-center text-secondary font-medium group-hover:translate-x-1 transition-transform">
            <span>View Cart</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </Link>

        <Link
          to="/profile"
          className="group bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="bg-accent/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
            <User className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-card-foreground mb-3 group-hover:text-accent transition-colors">
            Your Profile
          </h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Manage your account settings and personal information
          </p>
          <div className="flex items-center text-accent font-medium group-hover:translate-x-1 transition-transform">
            <span>Manage Profile</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
