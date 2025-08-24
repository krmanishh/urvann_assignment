"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendOTP, verifyOTP, clearInvalidTokens } from "../Redux/authSlice";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  Mail,
  User,
  UserCheck,
  KeyRound,
  ArrowRight,
  Leaf,
  Loader2,
} from "lucide-react";

const Register = () => {
  const [step, setStep] = useState("details");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    role: "user",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get authentication state from Redux
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // Clear any invalid tokens when component mounts
  useEffect(() => {
    console.log("🧹 Register: Clearing any existing invalid tokens");
    dispatch(clearInvalidTokens());
  }, [dispatch]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log("🚫 User already logged in, redirecting from register...");
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/catalog");
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.email || !formData.username || !formData.fullName) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    console.log("🚀 Register: Sending OTP with data:", formData);

    try {
      const result = await dispatch(sendOTP(formData)).unwrap();
      console.log("✅ Register: OTP sent successfully, result:", result);
      setStep("otp");
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error("❌ Register: Failed to send OTP, error:", error);
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log(
      "🔐 Register: Verifying OTP for email:",
      formData.email,
      "OTP:",
      formData.otp
    );

    try {
      const result = await dispatch(
        verifyOTP({ email: formData.email, otp: formData.otp })
      ).unwrap();
      console.log("✅ Register: OTP verified successfully, result:", result);
      toast.success("Registration successful!");

      // Redirect after successful registration
      if (result.user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/catalog");
      }
    } catch (error) {
      console.error("❌ Register: Failed to verify OTP, error:", error);
      toast.error(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Don't render if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-xl border border-border animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-card-foreground mb-2">
            {step === "details" ? "Join FloraVibe" : "Verify Your Email"}
          </h2>
          <p className="text-muted-foreground">
            {step === "details"
              ? "Create your account to start your plant journey"
              : "Enter the code we sent to your email"}
          </p>
        </div>

        {step === "details" ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-card-foreground text-sm font-semibold mb-3">
                Email Address <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-card-foreground text-sm font-semibold mb-3">
                Username <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Choose a username"
                  className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-card-foreground text-sm font-semibold mb-3">
                Full Name <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <UserCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-card-foreground text-sm font-semibold mb-3">
                Account Type
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 text-foreground"
              >
                <option value="user">Plant Enthusiast</option>
                <option value="admin">Store Administrator</option>
              </select>
              <p className="text-xs text-muted-foreground mt-2">
                Choose 'Store Administrator' if you need management access
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-xl hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Send OTP</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-secondary font-semibold transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-card-foreground text-sm font-semibold mb-3">
                Verification Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 text-foreground placeholder:text-muted-foreground text-center text-lg font-mono tracking-widest"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                We've sent a 6-digit code to{" "}
                <span className="font-medium text-primary">
                  {formData.email}
                </span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-xl hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify & Complete Registration</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep("details")}
              className="w-full text-primary hover:text-secondary transition-colors font-medium"
            >
              ← Back to Registration
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
