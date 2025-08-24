import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendOTP, verifyOTP, clearInvalidTokens } from '../Redux/authSlice';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Login = () => {
  const [step, setStep] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get authentication state from Redux
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // Clear any invalid tokens when component mounts
  useEffect(() => {
    console.log('🧹 Login: Clearing any existing invalid tokens');
    dispatch(clearInvalidTokens());
  }, [dispatch]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🚫 User already logged in, redirecting...');
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
    setLoading(true);
    
    console.log('🚀 Login: Sending OTP for email:', formData.email);
    
    try {
      const result = await dispatch(sendOTP({ email: formData.email })).unwrap();
      console.log('✅ Login: OTP sent successfully, result:', result);
      setStep('otp');
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('❌ Login: Failed to send OTP, error:', error);
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('🔐 Login: Verifying OTP for email:', formData.email, 'OTP:', formData.otp);
    
    try {
      const result = await dispatch(verifyOTP({ email: formData.email, otp: formData.otp })).unwrap();
      console.log('✅ Login: OTP verified successfully, result:', result);
      toast.success('Login successful!');
      
      // Redirect after successful login
      if (result.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/catalog');
      }
    } catch (error) {
      console.error('❌ Login: Failed to verify OTP, error:', error);
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
        {step === 'email' ? 'Login' : 'Enter OTP'}
      </h2>
      
      {step === 'email' ? (
        <form onSubmit={handleSendOTP}>
          <div className="mb-6">
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
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">
                Register here
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
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          <button
            type="button"
            onClick={() => setStep('email')}
            className="w-full mt-2 text-green-600 hover:text-green-700"
          >
            Back to Login
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
