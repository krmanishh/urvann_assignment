import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // Redirect if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🚫 User already logged in, redirecting from home...');
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/catalog');
      }
    }
  }, [isAuthenticated, role, navigate]);

  // Don't render if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-green-800 mb-6">
          Welcome to Plant Store
        </h1>
        <p className="text-xl text-green-600 mb-8">
          Discover beautiful plants for your home and garden
        </p>
        <div className="space-x-4">
          <Link
            to="/catalog"
            className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Browse Plants
          </Link>
          <Link
            to="/login"
            className="bg-white text-green-600 px-6 py-3 rounded-lg text-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
