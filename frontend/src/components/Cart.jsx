import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, removeFromCart, clearCart } from "../Redux/cartSlice";
import { toast } from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: cartItems = [], loading } = useSelector((state) => state.cart);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  const handleRemoveFromCart = async (plantId) => {
    try {
      await dispatch(removeFromCart(plantId)).unwrap();
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total + (item?.plant?.price || 0) * (item?.quantity || 0),
      0
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Please login to view your cart
        </h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Your cart is empty</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {cartItems.map((item) => (
            <div
              key={item?._id}
              className="flex items-center justify-between py-4 border-b border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  {item?.plant?.image ? (
                    <img
                      src={item.plant.image}
                      alt={item?.plant?.name || "Plant"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400">🌱</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {item?.plant?.name || "Unnamed Plant"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Quantity: {item?.quantity || 0}
                  </p>
                  <p className="text-green-600 font-semibold">
                    ₹{item?.plant?.price || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold">
                  $
                  {((item?.plant?.price || 0) * (item?.quantity || 0)).toFixed(
                    2
                  )}
                </span>
                <button
                  onClick={() =>
                    item?.plant?._id && handleRemoveFromCart(item.plant._id)
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleClearCart}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear Cart
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
