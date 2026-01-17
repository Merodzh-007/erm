import type z from 'zod'
import { productDtoSchema } from './products.schemas'

export type TProductDto = z.infer<typeof productDtoSchema>
export type TSaleItemForm = {
  product_id: string
  quantity: string
  last_unit_price: string
  purchase_cost: string
  selling_price: string
}
export type TPostProductCredentials = Omit<TProductDto, 'id' | 'created_at' | 'last_unit_price' | 'total_stock'>
export type TPostProductResponseSuccess = {
  id: number
  name: string
  manufacturer?: string
  message: string
}
