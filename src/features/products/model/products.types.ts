import type z from 'zod'
import { productDtoSchema } from './products.schemas'

export type TProductDto = z.infer<typeof productDtoSchema>
export type TPostProductResponseSuccess = {
  id: number
  name: string
  manufacturer?: string
  message: string
}
