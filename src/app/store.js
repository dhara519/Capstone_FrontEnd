import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import registerReducer from "../components/Register/RegisterSlice";
import loginReducer from "../components/Login/LoginSlice";
import yelpReducer from "../components/Restaurants/YelpSlice";
import favoritesReducer from "../components/Account/Favorites/favoriteSlice";
import destroyFavoritesReducer from "../components/Account/Favorites/favoriteSlice";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    register: registerReducer,
    login: loginReducer,
    yelp: yelpReducer,
    destroyFavorites: destroyFavoritesReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;