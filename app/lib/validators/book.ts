import { z } from 'zod'

export const BuchSchema = z.object({
  id: z.number(),
  version: z.number(),
  isbn: z.string().regex(/^978-\d-\d{3}-\d{5}-\d$/),
  rating: z.number().int(),
  art: z.enum(['DRUCKAUSGABE', 'KINDLE']),
  preis: z.number(),
  rabatt: z.number(),
  lieferbar: z.boolean(),
  datum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  homepage: z.string().url(),
  schlagwoerter: z.array(z.string()),
  titel: z.object({
    titel: z.string(),
    untertitel: z.string(),
  }),
  abbildungen: z
    .array(
      z.object({
        id: z.number(),
        url: z.string().url(),
      }),
    )
    .optional(),
})

export type Buch = z.infer<typeof BuchSchema>
