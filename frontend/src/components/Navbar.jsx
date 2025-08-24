"use client"

import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../Redux/authSlice"
import { Leaf, ShoppingCart, User, LogOut, Home, Package } from "lucide-react"

const Navbar = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    console.log("🚪 User logging out...")
    dispatch(logout())
    navigate("/")
  }

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            to="/"
            className="flex items-center space-x-3 text-2xl font-bold text-primary hover:text-secondary transition-colors"
          >
            <div className="bg-primary text-primary-foreground p-2 rounded-xl">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">FloraDeal</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/catalog"
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors font-medium"
            >
              <Package className="w-4 h-4" />
              <span>Catalog</span>
            </Link>
            {isAuthenticated && (
              <Link
                to="/cart"
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart</span>
              </Link>
            )}
            {isAuthenticated && role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                <User className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
            {!isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-foreground hover:text-primary transition-colors font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-secondary transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-foreground hover:text-destructive transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
