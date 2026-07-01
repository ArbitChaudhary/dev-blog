import { baseApi } from "@/redux/api/base-api";

export interface Post {
  id: string;
  title: string;
  content: string;
}

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "posts",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Post" as const, id })),
              { type: "Post" as const, id: "LIST" },
            ]
          : [{ type: "Post" as const, id: "LIST" }],
    }),
    getPost: builder.query<Post, string>({
      query: (id) => `posts/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),
    createPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({
        url: "posts",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPostsQuery, useGetPostQuery, useCreatePostMutation } =
  postsApi;
