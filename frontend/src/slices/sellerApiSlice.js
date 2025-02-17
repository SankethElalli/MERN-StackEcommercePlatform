import { apiSlice } from './apiSlice';

export const sellerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSellerProducts: builder.query({
      query: () => ({
        url: '/api/seller/products',
      }),
      keepUnusedDataFor: 5,
    }),
    createSellerProduct: builder.mutation({
      query: (data) => ({
        url: '/api/seller/products',
        method: 'POST',
        body: data,
      }),
    }),
    updateSellerProduct: builder.mutation({
      query: (data) => ({
        url: `/api/seller/products/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteSellerProduct: builder.mutation({
      query: (productId) => ({
        url: `/api/seller/products/${productId}`,
        method: 'DELETE',
      }),
    }),
    getSellerOrders: builder.query({
      query: () => ({
        url: '/api/seller/orders',
      }),
    }),
    updateSellerProfile: builder.mutation({
      query: (data) => ({
        url: '/api/seller/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    getDashboardStats: builder.query({
      query: () => ({
        url: '/api/seller/dashboard-stats',
      }),
      keepUnusedDataFor: 5,
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: '/api/upload/product',
        method: 'POST',
        body: data,
      }),
    }),
    uploadLogo: builder.mutation({
      query: (data) => ({
        url: '/api/upload/logo',
        method: 'POST',
        body: data,
        formData: true,
      }),
    }),
    uploadSellerLogo: builder.mutation({
      query: (data) => ({
        url: '/api/upload/logo',
        method: 'POST',
        body: data,
      }),
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `/api/orders/${orderId}/deliver`,
        method: 'PUT',
        credentials: 'include'
      }),
    }),
  }),
});

export const {
  useGetSellerProductsQuery,
  useCreateSellerProductMutation,
  useUpdateSellerProductMutation,
  useDeleteSellerProductMutation,
  useGetSellerOrdersQuery,
  useUpdateSellerProfileMutation,
  useGetDashboardStatsQuery,
  useUploadProductImageMutation,
  useUploadLogoMutation,
  useUploadSellerLogoMutation,
  useDeliverOrderMutation,
} = sellerApiSlice;
