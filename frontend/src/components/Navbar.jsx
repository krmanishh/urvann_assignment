import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Redux/authSlice";

const Navbar = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items); // ✅ cart items from redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("🚪 User logging out...");
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            🌱 Plant Store
          </Link>

          <div className="flex space-x-6">
            <Link to="/" className="hover:text-green-200 transition-colors">
              Home
            </Link>
            <Link
              to="/catalog"
              className="hover:text-green-200 transition-colors"
            >
              Catalog
            </Link>
            {isAuthenticated && (
              <Link
                to="/cart"
                className="relative hover:text-green-200 transition-colors"
              >
                Cart
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-1 py-0.25 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated && role === "admin" && (
              <Link
                to="/admin"
                className="hover:text-green-200 transition-colors"
              >
                Admin
              </Link>
            )}
            {!isAuthenticated ? (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="hover:text-green-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hover:text-green-200 transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="hover:text-green-200 transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-green-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
