import { api } from "../../../app/api";
import { createSlice } from "@reduxjs/toolkit";

const FavoritesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    postFavorites: builder.mutation({
      query: (obj) => ({
        url: `/api/user/${obj.userId}/favorite_restaurant`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
        body: obj,
      }),
      invalidatesTags: ["User"],
    }),
    destroyFavorites: builder.mutation({
      query: ({ userId, favoriteRestaurantId }) => ({
        url: `/api/user/${userId}/deleteFavoriteRestaurants/${favoriteRestaurantId}`,
        method: "DELETE",
        body: { userId, favoriteRestaurantId },
      }),
      invalidatesTags: ["User"],
    }),
    fetchFavorites: builder.query({
      query: (userId) => ({
        url: `/api/user/${userId}/favorite_restaurants`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

function storeToken(state, { payload }) {
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (error) {
      console.error("Error parsing payload:", error);
      return;
    }
  }
  state.token = payload.token;
  state.user = payload.user;
  window.sessionStorage.setItem("token", payload.token);
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    token: window.sessionStorage.getItem("token"),
    isLoggedIn: false,
    user: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      FavoritesApi.endpoints.postFavorites.matchFulfilled,
      storeToken
    );
    builder.addMatcher(
      FavoritesApi.endpoints.destroyFavorites.matchFulfilled,
      storeToken
    );
  },
});

export const {
  usePostFavoritesMutation,
  useDestroyFavoritesMutation,
  useFetchFavoritesQuery,
} = FavoritesApi;
export default favoritesSlice.reducer;
export const selectIsLoggedIn = (state) => state.login.isLoggedIn;
