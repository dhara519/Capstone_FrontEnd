import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://capstone-backend-a5zw.onrender.com",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().register?.token || getState().login.token;
      const sessionToken = window.sessionStorage.getItem("token");
      // localStorage.removeItem("token");
      if (token || sessionToken) {
        headers.set("authorization", `Bearer ${token || sessionToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Update", "Delete"],
  endpoints: () => ({}),
});
