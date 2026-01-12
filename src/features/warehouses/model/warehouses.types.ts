import type z from 'zod'
import { warehouseSchema } from './warehouses.schemas'

export type TWarehouse = z.infer<typeof warehouseSchema>
export type TPostWarehouseSuccess = { id: number; message: string; name: string }

export type TMutateWarehouse = {
  name: string
}
