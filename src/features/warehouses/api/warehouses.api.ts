import { baseApi } from '@/shared/request/baseApi'
import type { TMutateWarehouse, TPostWarehouseSuccess, TWarehouse } from '../model/warehouses.types'
import { warehouseSchema } from '../model/warehouses.schemas'

const warehousesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWarehouses: build.query<TWarehouse[], void>({
      query: () => ({
        url: '/warehouses',
        method: 'GET',
      }),
      transformResponse: (response) => warehouseSchema.array().parseAsync(response),
      providesTags: ['Warehouses'],
    }),
    postWarehouse: build.mutation<TPostWarehouseSuccess, TMutateWarehouse>({
      query: (data) => ({
        url: '/warehouses',
        method: 'POST',
        body: { name: data.name },
      }),
      invalidatesTags: ['Warehouses'],
    }),
    deleteWarehouse: build.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/warehouses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Warehouses'],
    }),
  }),
})
export const { useGetWarehousesQuery, usePostWarehouseMutation, useDeleteWarehouseMutation } = warehousesApi
