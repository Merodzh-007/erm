import type z from 'zod'
import { oneReceiptGtoSchema, receiptGtoSchema } from './receipt.schemas'

export type TReceiptItem = {
  product_id: number | null
  product_query: string
  boxes_qty: string
  pieces_qty: string
  weight_kg: string
  amount: string
  volume_cbm: string
  markup_percent: string
  purchase_cost: string
  selling_price: string
}
type TReceiptItemResponse = {
  boxes_qty: string
  pieces_qty: string
  weight_kg: string
  amount: string

  purchase_cost: string
  selling_price: string
}
export type TCreateReceipt = {
  warehouse_id: number
  items: TReceiptItemResponse[]
}
export type TReceiptGto = z.infer<typeof receiptGtoSchema>
export type TOneReceiptGto = z.infer<typeof oneReceiptGtoSchema>
