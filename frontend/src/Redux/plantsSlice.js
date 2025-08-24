import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../Helper/axios';

export const fetchPlants = createAsyncThunk(
  'plants/fetchPlants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/plants');
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plants');
    }
  }
);

export const addPlant = createAsyncThunk(
  'plants/addPlant',
  async (plantData, { rejectWithValue }) => {
    try {
      console.log('🌱 Adding plant with data:', plantData);
      const response = await axiosInstance.post('/plants', plantData);
      console.log('✅ Plant added successfully:', response.data);
      
      // Extract data from ApiResponse structure (same as other endpoints)
      const data = response.data.data || response.data;
      return data;
    } catch (error) {
      console.error('❌ Failed to add plant:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to add plant');
    }
  }
);

const plantsSlice = createSlice({
  name: 'plants',
  initialState: {
    plants: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlants.fulfilled, (state, action) => {
        state.loading = false;
        state.plants = action.payload;
        state.error = null;
      })
      .addCase(fetchPlants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPlant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPlant.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Add the new plant to the list
        if (action.payload && Array.isArray(state.plants)) {
          state.plants.push(action.payload);
        }
      })
      .addCase(addPlant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = plantsSlice.actions;
export default plantsSlice.reducer;
