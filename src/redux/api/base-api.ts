import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Central API definition. Endpoints are added from feature files via
 * `baseApi.injectEndpoints(...)` so that each feature keeps its own queries
 * and mutations co-located while sharing a single API slice/cache.
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  // Declare cache tag types here so injected endpoints can provide/invalidate them.
  tagTypes: ["Post", "UserProfile"],
  endpoints: () => ({}),
});
