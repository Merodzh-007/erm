import z from 'zod'

export const productDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  manufacturer: z.string().nullable(),
  created_at: z.string(),
})
