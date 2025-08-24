import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Helper/axios';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPlants: 0,
    categories: 0,
    inStock: 0,
    totalValue: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, role, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch plants data
        const plantsResponse = await axiosInstance.get('/plants');
        const plants = plantsResponse.data.data || plantsResponse.data || [];
        
        // Calculate metrics from real data
        const totalPlants = plants.length;
        const inStock = plants.filter(plant => plant.inStock).length;
        
        // Get unique categories
        const allCategories = plants.flatMap(plant => plant.categories || []);
        const uniqueCategories = [...new Set(allCategories)];
        const categories = uniqueCategories.length;
        
        // Calculate total value
        const totalValue = plants.reduce((sum, plant) => sum + (plant.price || 0), 0);
        
        // Generate recent activity based on actual data
        const recentActivity = generateRecentActivity(plants);
        
        setDashboardData({
          totalPlants,
          categories,
          inStock,
          totalValue,
          recentActivity
        });
        
      } catch (error) {
        console.error('❌ Failed to fetch dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && role === 'admin') {
      fetchDashboardData();
    }
  }, [isAuthenticated, role]);

  // Generate recent activity from plants data
  const generateRecentActivity = (plants) => {
    if (!plants || plants.length === 0) {
      return [
        { action: 'No plants available', time: 'Just now' }
      ];
    }

    // Sort plants by creation date (newest first)
    const sortedPlants = [...plants].sort((a, b) => 
      new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt)
    );

    const activities = [];
    
    // Add recent plant additions
    sortedPlants.slice(0, 3).forEach(plant => {
      const timeAgo = getTimeAgo(plant.createdAt || plant.updatedAt);
      activities.push({
        action: `New plant "${plant.name}" added`,
        time: timeAgo
      });
    });

    // Add stock updates for plants not in stock
    const outOfStockPlants = plants.filter(plant => !plant.inStock).slice(0, 2);
    outOfStockPlants.forEach(plant => {
      const timeAgo = getTimeAgo(plant.updatedAt || plant.createdAt);
      activities.push({
        action: `Plant "${plant.name}" stock updated`,
        time: timeAgo
      });
    });

    // Add category activity
    if (activities.length < 5) {
      const uniqueCategories = [...new Set(plants.flatMap(plant => plant.categories || []))];
      uniqueCategories.slice(0, 2).forEach(category => {
        activities.push({
          action: `Category "${category}" has plants`,
          time: 'Recently'
        });
      });
    }

    return activities.slice(0, 5); // Limit to 5 activities
  };

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    
    return 'Recently';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Don't render if not authenticated or not admin
  if (!isAuthenticated || role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Analytics Dashboard</h1>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {dashboardData.totalPlants}
            </div>
            <div className="text-gray-600">Total Plants</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {dashboardData.categories}
            </div>
            <div className="text-gray-600">Categories</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {dashboardData.inStock}
            </div>
            <div className="text-gray-600">In Stock</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {formatCurrency(dashboardData.totalValue)}
            </div>
            <div className="text-gray-600">Total Value</div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {dashboardData.recentActivity.map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-700">{activity.action}</span>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
