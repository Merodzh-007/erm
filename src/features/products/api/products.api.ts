import { baseApi } from '@/shared/request/baseApi'
import type { TPostProductCredentials, TPostProductResponseSuccess, TProductDto } from '../model/products.types'
import { productDtoSchema } from '../model/products.schemas'

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<TProductDto[], void>({
      query: () => ({
        url: '/products',
        method: 'GET',
      }),
      transformResponse: (response) => productDtoSchema.array().parseAsync(response),
      providesTags: ['Products'],
    }),
    postProduct: build.mutation<TPostProductResponseSuccess, TPostProductCredentials>({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: build.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
})

export const { useGetProductsQuery, usePostProductMutation, useDeleteProductMutation } = productsApi
