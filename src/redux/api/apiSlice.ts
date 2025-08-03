import { createApi } from "@reduxjs/toolkit/query/react";
import { enhancedFetchBaseQuery } from "./advancedFetchBaseQuery";

// Create the API slice with enhanced fetch base query
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: enhancedFetchBaseQuery,
  tagTypes: ["Orders", "Order", "User", "AI"],
  endpoints: () => ({}),
});
