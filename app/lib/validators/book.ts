import { z } from 'zod'

export const BuchSchema = z.object({
  id: z.string(),
  version: z.string().optional(),
  isbn: z.string().regex(/^978-\d-\d{3}-\d{5}-\d$/),
  rating: z.number().int(),
  art: z.enum(['DRUCKAUSGABE', 'KINDLE']),
  preis: z.number().positive(),
  rabatt: z.number().nonnegative(),
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

export const BuchUpdateSchema = z.object({
  version: z.string(),
  isbn: z
    .string()
    .min(1, 'ISBN is required.')
    .regex(/^978-\d-\d{3}-\d{5}-\d$/, 'Invalid ISBN.'),
  rating: z.number().min(1).max(5),
  art: z.enum(['DRUCKAUSGABE', 'KINDLE']),
  preis: z.number(),
  rabatt: z.number(),
  lieferbar: z.boolean(),
  homepage: z.string().min(1, 'Homepage is required.').url('Invalid Homepage.'),
  titelwrapper: z.string().min(1, 'Titel is required.'),
  untertitelwrapper: z.string().min(1, 'Untertitel is required.'),
})

export const BuchCreateSchema = z.object({
  isbn: z
    .string()
    .min(1, 'ISBN is required.')
    .regex(/^978-\d-\d{3}-\d{5}-\d$/, 'Invalid ISBN.'),
  rating: z.number().min(1).max(5),
  art: z.enum(['DRUCKAUSGABE', 'KINDLE']),
  preis: z.number().positive(),
  lieferbar: z.boolean(),
  homepage: z.string().min(1, 'Homepage is required.').url('Invalid Homepage.'),
  titelwrapper: z.string().min(1, 'Titel is required.'),
  untertitelwrapper: z.string().min(1, 'Untertitel is required.'),
})

export const BuchUpdateSchlagwoerterSchema = z.object({
  version: z.string(),
  access_token: z.string(),
  schlagwoerter: z.string(),
})

export type Buch = z.infer<typeof BuchSchema>
export type BuchUpdate = z.infer<typeof BuchUpdateSchema>
export type BuchCreate = z.infer<typeof BuchCreateSchema>
export type BuchUpdateSchlagwoerter = z.infer<
  typeof BuchUpdateSchlagwoerterSchema
>
