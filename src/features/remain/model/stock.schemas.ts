import z from 'zod'

export const warehouseStockSchema = z.object({
  id: z.number(),
  warehouse_id: z.number(),
  warehouse_name: z.string(),
  product_id: z.number(),
  product_name: z.string(),
  boxes_qty: z.number(),
  pieces_qty: z.number(),
  weight_kg: z.string(),
  volume_cbm: z.string(),
  updated_at: z.string(),
})

export const historyStockSchema = z.object({
  id: z.number(),
  warehouse_id: z.number(),
  warehouse_name: z.string(),
  product_id: z.number(),
  product_name: z.string(),
  manufacturer: z.string(),
  user_id: z.number().default(1),
  user_name: z.string(),
  change_type: z.enum(['ADJUSTMENT', 'IN', 'OUT']).default('ADJUSTMENT'),
  old_boxes_qty: z.number().default(10),
  new_boxes_qty: z.number().default(15),
  old_pieces_qty: z.number().default(20),
  new_pieces_qty: z.number().default(25),
  old_weight_kg: z.number().default(50.5),
  new_weight_kg: z.number().default(60.0),
  old_volume_cbm: z.number().default(2.5),
  new_volume_cbm: z.number().default(3.0),
  reason: z.string().default('Корректировка по инвентаризации'),
  created_at: z.string(),
})
