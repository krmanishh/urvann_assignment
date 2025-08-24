"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Leaf,
  ArrowRight,
  Sparkles,
  Heart,
  TreePine,
  Flower2,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // Redirect if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log("🚫 User already logged in, redirecting from home...");
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/catalog");
      }
    }
  }, [isAuthenticated, role, navigate]);

  // Don't render if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-green-100 p-4 rounded-full shadow-sm">
                <Leaf className="w-12 h-12 text-green-600" />
              </div>
              <div className="absolute -top-1 -right-1 bg-emerald-200 p-1 rounded-full">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-800">
            <span className="text-green-600">Plant</span>
            <span className="text-emerald-500">Haven</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-3 max-w-2xl mx-auto font-medium">
            Your friendly neighborhood plant shop 🌱
          </p>

          <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
            We hand-pick every plant with love and care. From tiny succulents to
            towering fiddle leaf figs, we'll help you find the perfect green
            friend for your space.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
            <Link
              to="/catalog"
              className="group bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <TreePine className="w-4 h-4" />
              <span>Browse Plants</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="bg-white text-green-700 px-6 py-3 rounded-lg text-base font-medium border-2 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 flex items-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>Join Us</span>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-all duration-200 text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Healthy & Happy Plants
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Every plant is carefully selected from local growers who share our
              passion for quality and sustainability.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-200 text-center">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Personal Care Guides
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get custom care tips for each plant, plus our team is always here
              to answer your questions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-teal-100 hover:shadow-md transition-all duration-200 text-center">
            <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flower2 className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Safe Delivery
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We package each plant with extra care to ensure it arrives at your
              door healthy and ready to thrive.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100 max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Started by plant lovers, for plant lovers
            </h3>
            <p className="text-gray-600 leading-relaxed">
              What began as a small collection in our apartment has grown into a
              community of thousands of plant parents. We believe everyone
              deserves a little green in their life, and we're here to make that
              happen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
