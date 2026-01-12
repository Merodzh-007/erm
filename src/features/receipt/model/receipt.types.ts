import type z from 'zod'
import { oneReceiptGtoSchema, receiptGtoSchema } from './receipt.schemas'

export type TReceiptItem = {
  product_id: string
  boxes_qty: string
  pieces_qty: string
  weight_kg: string
  volume_cbm: string
  amount: string
}
export type TCreateReceipt = {
  warehouse_id: number
  items: TReceiptItem[]
}
export type TReceiptGto = z.infer<typeof receiptGtoSchema>
export type TOneReceiptGto = z.infer<typeof oneReceiptGtoSchema>
