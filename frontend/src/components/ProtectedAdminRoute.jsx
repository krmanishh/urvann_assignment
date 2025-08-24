import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
    const authState = useSelector((state) => state.auth);
    
    console.log("🔒 ProtectedAdminRoute - Auth State:", authState);
    
    // Safely destructure with fallbacks
    const role = authState?.role || null;
    const isAuthenticated = authState?.isAuthenticated || false;
    
    console.log("🔒 ProtectedAdminRoute - Extracted values:", { role, isAuthenticated });
    
    if (!isAuthenticated || role !== "admin") {
        console.log("🚫 Access denied, redirecting to login");
        return <Navigate to="/login" replace />;
    }
    
    console.log("✅ Admin access granted");
    return children;
};

export default ProtectedAdminRoute;
