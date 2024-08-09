import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../app/api";

const loginApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/user/login",
        method: "POST",
        body: credentials,
      }),
      providesTags: ["User"],
    }),
    updatesUser: builder.mutation({
      query: ({ id, firstName, lastName, password }) => ({
        url: `/api/user/${id}/change`,
        method: "PUT",
        body: { firstName, lastName, password },
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/api/user/${id}/delete_user`,
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["delete"],
    }),
  }),
});

const storeTokenReducer = (state, { payload }) => {
  state.token = payload.token;
  state.isLoggedIn = true;
  window.sessionStorage.setItem("token", payload.token);
  const user = {
    email: payload.email,
    firstName: payload.firstName,
    id: payload.id, // Ensure the ID is stored here
    lastName: payload.lastName,
  };
  window.sessionStorage.setItem("user", JSON.stringify(user));
  state.user = user; // Store user in state
};

const initialState = {
  token: window.sessionStorage.getItem("token") || null,
  isLoggedIn: !!window.sessionStorage.getItem("token"),
  user: JSON.parse(window.sessionStorage.getItem("user")) || {},
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    storeToken: storeTokenReducer,
    clearToken: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.user = {};
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      loginApi.endpoints.login.matchFulfilled,
      storeTokenReducer
    );
    builder.addMatcher(
      loginApi.endpoints.updatesUser.matchFulfilled,
      (state, { payload }) => {
        state.user = { ...state.user, ...payload };
        window.sessionStorage.setItem("user", JSON.stringify(state.user));
      }
    );
    builder.addMatcher(
      loginApi.endpoints.deleteUser.matchFulfilled,
      (state) => {
        state.token = null;
        state.isLoggedIn = false;
        state.user = {};
        window.sessionStorage.removeItem("token");
        window.sessionStorage.removeItem("user");
      }
    );
  },
});

export default loginSlice.reducer;
export const { storeToken, clearToken } = loginSlice.actions;
export const {
  useLoginMutation,
  useUpdatesUserMutation,
  useDeleteUserMutation,
} = loginApi;
export const selectIsLoggedIn = (state) => state.login.isLoggedIn;
export const selectUserId = (state) => state.login.user?.id; // Selector to get userId