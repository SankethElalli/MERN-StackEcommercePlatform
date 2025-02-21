import { apiSlice } from './apiSlice';

export const videoBannersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVideoBanners: builder.query({
      query: () => ({
        url: '/api/videobanners',
      }),
      keepUnusedDataFor: 5,
    }),
    deleteVideoBanner: builder.mutation({
      query: (id) => ({
        url: `/api/videobanners/${id}`,
        method: 'DELETE',
      }),
    }),
    updateVideoBannerStatus: builder.mutation({
      query: (data) => ({
        url: `/api/videobanners/${data.id}/status`,
        method: 'PUT',
        body: data,
      }),
    }),
    uploadVideoBanner: builder.mutation({
      query: (data) => ({
        url: '/api/upload/video',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetVideoBannersQuery,
  useDeleteVideoBannerMutation,
  useUpdateVideoBannerStatusMutation,
  useUploadVideoBannerMutation,
} = videoBannersApiSlice;
