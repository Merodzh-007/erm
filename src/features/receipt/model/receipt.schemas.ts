import z from 'zod'

export const receiptGtoSchema = z.object({
  id: z.number(),
  warehouse_id: z.number(),
  warehouse_name: z.string(),
  created_by: z.number(),
  created_by_name: z.string(),
  created_at: z.string(),
  total_amount: z.string(),
})

export const oneReceiptGtoSchema = z.object({
  id: z.number(),
  warehouse_id: z.number(),
  warehouse_name: z.string(),
  created_by: z.number(),
  created_by_name: z.string(),
  created_at: z.string().datetime(),
  total_amount: z.string(),
  items: z.array(
    z.object({
      id: z.number(),
      product_id: z.number().nullable(),
      product_name: z.string().nullable(),
      manufacturer: z.string().nullable(),
      boxes_qty: z.number().nullable(),
      pieces_qty: z.number().nullable(),
      weight_kg: z.string().nullable(),
      volume_cbm: z.string().nullable(),
      amount: z.string().nullable(),
    })
  ),
})
