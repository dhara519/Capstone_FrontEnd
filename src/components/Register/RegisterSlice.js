import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../app/api";

const registerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/api/user/register",
        method: "POST",
        body: credentials,
      }),
      invalidateTags: ["User"],
    }),
  }),
});

const storeToken = (state, { payload }) => {
  const user = {
    email: payload.email,
    firstName: payload.firstName,
    id: payload.id,
    lastName: payload.lastName,
  };
  window.sessionStorage.setItem("user", JSON.stringify(user));

  state.token = payload.token;
  state.user = user;
  window.sessionStorage.setItem("token", payload.token);
};
const registerSlice = createSlice({
  name: "register",
  initialState: {
    users: {},
    token: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(api.endpoints.register.matchFulfilled, storeToken);
  },
});

export default registerSlice.reducer;

export const { useRegisterMutation } = registerApi;