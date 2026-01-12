import { baseApi } from '@/shared/request/baseApi'
import type { TCreateReceipt, TOneReceiptGto, TReceiptGto } from '../model/receipt.types'
import { oneReceiptGtoSchema, receiptGtoSchema } from '../model/receipt.schemas'

const receiptApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postReceipt: build.mutation<{ id: number; message: string }, TCreateReceipt>({
      query: (body) => ({
        url: '/inventory/receipt',
        method: 'POST',
        body,
      }),
    }),
    getReceipts: build.query<TReceiptGto[], void>({
      query: () => ({
        url: '/inventory/receipts',
        method: 'GET',
      }),
      transformResponse: (response) => receiptGtoSchema.array().parseAsync(response),
    }),
    getOneReceipt: build.query<TOneReceiptGto, string>({
      query: (id) => ({
        url: `/inventory/receipt/${id}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        console.log('response', response)

        return oneReceiptGtoSchema.parseAsync(response)
      },
    }),
  }),
})

export const { usePostReceiptMutation, useGetReceiptsQuery, useGetOneReceiptQuery } = receiptApi
