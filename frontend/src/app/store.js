import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../Redux/authSlice.js";
import cartReducer from "../Redux/cartSlice.js";
import plantsReducer from "../Redux/plantsSlice.js";

export const store=configureStore({
    reducer:{
        auth: authReducer,
        cart: cartReducer,
        plants: plantsReducer,
    }
})