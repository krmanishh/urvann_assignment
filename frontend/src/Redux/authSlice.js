import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from '../Helper/axios';

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('🔄 Sending OTP request with data:', userData);
      const response = await axiosInstance.post('/users/send-otp', userData);
      console.log('✅ OTP Response received:', response.data);
      
      // Extract data from ApiResponse structure
      const data = response.data.data || response.data;
      console.log('📦 Extracted data:', data);
      
      return data;
    } catch (error) {
      console.error('❌ OTP Send Error:', error);
      console.error('❌ Error response:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      console.log('🔐 Verifying OTP for email:', email, 'with OTP:', otp);
      const response = await axiosInstance.post('/users/verify-otp', { email, otp });
      console.log('✅ OTP Verification Response:', response.data);
      
      // Extract data from ApiResponse structure
      const responseData = response.data;
      console.log('📦 Full response data:', responseData);
      
      const data = responseData.data;
      console.log('🔑 Extracted auth data:', data);
      
      console.log('💾 Storing in localStorage:');
      console.log('  - Token:', data.accessToken ? 'Present' : 'Missing');
      console.log('  - Refresh Token:', data.refreshToken ? 'Present' : 'Missing');
      console.log('  - User Role:', data.user?.role);
      console.log('  - User Data:', data.user);
      
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('✅ OTP verification successful, returning data');
      return data;
    } catch (error) {
      console.error('❌ OTP Verification Error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error message:', error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      console.log('🔄 Refreshing token, current refresh token:', refreshTokenValue ? 'Present' : 'Missing');
      
      if (!refreshTokenValue) {
        throw new Error('No refresh token found');
      }

      const response = await axiosInstance.post('/users/refresh-token', { refreshToken: refreshTokenValue });
      console.log('✅ Token refresh response:', response.data);
      
      // Extract data from ApiResponse structure
      const data = response.data.data || response.data;
      console.log('🔑 Extracted refresh data:', data);
      
      localStorage.setItem('token', data.accessToken);
      console.log('💾 New token stored in localStorage');
      
      return data;
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to refresh token');
    }
  }
);

const initialState = {
  role: localStorage.getItem("role") || null,
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isAdmin: localStorage.getItem("role") === "admin",
  isUser: localStorage.getItem("role") === "user",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      state.token = null;
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.isUser = false;
    },
    clearError: (state) => {
      state.error = null;
      state.isError = false;
    },
    clearInvalidTokens: (state) => {
      console.log('🧹 Redux: Clearing invalid tokens from localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      state.token = null;
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.isUser = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTP.pending, (state) => {
        console.log('🔄 Redux: sendOTP pending');
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        console.log('✅ Redux: sendOTP fulfilled');
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        console.log('❌ Redux: sendOTP rejected with payload:', action.payload);
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(verifyOTP.pending, (state) => {
        console.log('🔄 Redux: verifyOTP pending');
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        console.log('✅ Redux: verifyOTP fulfilled with payload:', action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
        state.isAdmin = action.payload.user.role === 'admin';
        state.isUser = action.payload.user.role === 'user';
        console.log('🔐 Redux: User authenticated, role:', action.payload.user.role);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        console.log('❌ Redux: verifyOTP rejected with payload:', action.payload);
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        console.log('✅ Redux: refreshToken fulfilled');
        state.token = action.payload.accessToken;
      })
      .addCase(refreshToken.rejected, (state) => {
        console.log('❌ Redux: refreshToken rejected');
        state.token = null;
        state.isAuthenticated = false;
        state.role = null;
        state.user = null;
        state.isAdmin = false;
        state.isUser = false;
      });
  }
});

export const { logout, clearError, clearInvalidTokens } = authSlice.actions;

export default authSlice.reducer;