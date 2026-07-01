import { baseApi } from "@/redux/api/base-api";
import { client } from "@/redux/api/client";
import type { Schema } from "../../../amplify/data/resource";

type UserProfile = Schema["UserProfile"]["type"];

export const userProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile | null, string>({
      queryFn: async (userId: string) => {
        try {
          const { data, errors } = await client.models.UserProfile.get({
            id: userId,
          });
          if (errors) {
            return { error: errors };
          }

          return { data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, userId) => [
        { type: "UserProfile", id: userId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserProfileQuery } = userProfileApi;
