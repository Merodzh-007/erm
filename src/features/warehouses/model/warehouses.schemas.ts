import z from 'zod'

export const warehouseSchema = z.object({
  id: z.number(),
  name: z.string(),
})
