import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendOTP, verifyOTP, clearInvalidTokens } from '../Redux/authSlice';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Register = () => {
  const [step, setStep] = useState('details');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    role: 'user',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get authentication state from Redux
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // Clear any invalid tokens when component mounts
  useEffect(() => {
    console.log('🧹 Register: Clearing any existing invalid tokens');
    dispatch(clearInvalidTokens());
  }, [dispatch]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🚫 User already logged in, redirecting from register...');
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/catalog');
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.email || !formData.username || !formData.fullName) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    console.log('🚀 Register: Sending OTP with data:', formData);
    
    try {
      const result = await dispatch(sendOTP(formData)).unwrap();
      console.log('✅ Register: OTP sent successfully, result:', result);
      setStep('otp');
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('❌ Register: Failed to send OTP, error:', error);
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('🔐 Register: Verifying OTP for email:', formData.email, 'OTP:', formData.otp);
    
    try {
      const result = await dispatch(verifyOTP({ email: formData.email, otp: formData.otp })).unwrap();
      console.log('✅ Register: OTP verified successfully, result:', result);
      toast.success('Registration successful!');
      
      // Redirect after successful registration
      if (result.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/catalog');
      }
    } catch (error) {
      console.error('❌ Register: Failed to verify OTP, error:', error);
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Don't render if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {step === 'details' ? 'Create Account' : 'Verify OTP'}
      </h2>
      
      {step === 'details' ? (
        <form onSubmit={handleSendOTP}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Choose a username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose 'Admin' if you need administrative access
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Sending OTP...' : 'Create Account & Send OTP'}
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              required
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              We've sent a 6-digit OTP to {formData.email}
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP & Complete Registration'}
          </button>
          
          <button
            type="button"
            onClick={() => setStep('details')}
            className="w-full mt-2 text-green-600 hover:text-green-700"
          >
            Back to Registration
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
