import { z } from 'zod'

// eslint-disable-next-line security/detect-unsafe-regex
export const ISBN_REGEX = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/

export const BuchSchema = z.object({
  id: z.string(),
  version: z.string().optional(),
  isbn: z.string().regex(ISBN_REGEX),
  rating: z.number().min(1).max(5),
  art: z.enum(['DRUCKAUSGABE', 'KINDLE']),
  preis: z.number().positive(),
  rabatt: z.number().min(1).max(5),
  lieferbar: z.boolean().optional(),
  datum: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  homepage: z.string().url().optional(),
  schlagwoerter: z.array(z.string()),
  titel: z.object({
    titel: z.string(),
    untertitel: z.string().optional(),
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

export const BuchWithLinkSchema = BuchSchema.extend({
  _links: z.object({
    self: z.object({
      href: z.string(),
    }),
  }),
})

export const BuchCreateSchema = z.object({
  isbn: z
    .string()
    .min(1, 'ISBN is required.')
    .regex(ISBN_REGEX, 'Invalid ISBN.'),
  rating: z
    .number()
    .min(1, 'Rating must be atleast 1 Star')
    .max(5, "Rating can't be more than 5 Stars."),
  art: z
    .enum(['DRUCKAUSGABE', 'KINDLE'])
    .refine((val) => val === 'DRUCKAUSGABE' || val === 'KINDLE', {
      message: "Type must be 'DRUCKAUSGABE' or 'KINDLE'.",
    }),
  preis: z.number().positive("Book can't be sold for 0 or lower."),
  rabatt: z
    .number()
    .min(0, "Discount can't be less than 0%.")
    .max(100, "Discount can't be more than 100%.")
    .optional(),
  lieferbar: z.boolean().optional(),
  homepage: z.string().url('Invalid Homepage.').optional(),
  titelwrapper: z.string().min(1, 'Title is required.'),
  untertitelwrapper: z.string().optional(),
})

export const BuchUpdateSchema = BuchCreateSchema.extend({
  version: z.string(),
})

export const BuchUpdateSchlagwoerterSchema = z.object({
  version: z.string(),
  schlagwoerter: z.string(),
})

export type Buch = z.infer<typeof BuchSchema>
export type BuchWithLink = z.infer<typeof BuchWithLinkSchema>
export type BuchCreate = z.infer<typeof BuchCreateSchema>
export type BuchUpdate = z.infer<typeof BuchUpdateSchema>
export type BuchUpdateSchlagwoerter = z.infer<
  typeof BuchUpdateSchlagwoerterSchema
>
