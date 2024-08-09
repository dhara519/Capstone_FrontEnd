import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetches data from yelp api and includes error handling
export const fetchYelpData = createAsyncThunk(
  "yelp/fetchYelpData",
  async ({ location, categories }, { rejectWithValue }) => {
    const apiKey =
      "9QtuvGD5XrRkiKnIuwnVUHNJr3xG20FmEvaszYwbDSaP3Pzw9zdtk36OCIbjheMnM1KAhSTQPBF4P57ms0SzsSySw1jMQHllzuNVOO8PIKDWWdFF-j9REq01Rq6WZnYx";
    const url = `https://api.yelp.com/v3/businesses/search?location=${location}&categories=${categories}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data; // Return the fetched data
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors by rejecting with error message
    }
  }
);
const storeToken = (state, { payload }) => {
  state.token = payload.token;
  state.isLoggedIn = true;
  window.sessionStorage.setItem("token", payload.token);
};

// Slice for managing data and state
const yelpSlice = createSlice({
  name: "yelp",
  initialState: {
    data: [],
    loading: false,
    error: null,
    favorites: [],
  },
  reducers: {
    // addFavorite: (state, action) => {
    //   state.favorites.push(action.payload);
    //   storeToken;
    // },
    // removeFavorite: (state, action) => {
    //   state.favorites = state.favorites.filter(
    //     (restaurant) => restaurant.id !== action.payload
    //   );
    //   storeToken;
    // },
  },
  extraReducers: (builder) => {
    // Handle pending state of fetchYelpData
    builder
      .addCase(fetchYelpData.pending, (state) => {
        state.loading = true; // set loading to true when fetching data
        state.error = null; // clear any previous errors
      })
      .addCase(fetchYelpData.fulfilled, (state, action) => {
        state.loading = false; // set loading to false when data is fetched
        state.data = action.payload; // store fetched data in state
      })
      .addCase(fetchYelpData.rejected, (state, action) => {
        state.loading = false; // set loading to false if fetching fails
        state.error = action.payload; // store error message in state
      });
  },
});

export default yelpSlice.reducer;
