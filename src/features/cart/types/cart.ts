import { z } from "zod";

export const CartItemSchema = z.object({
  key: z.string(),
  id: z.number(),
  name: z.string(),
  price: z.string(),
  quantity: z.number(),
  totals: z.object({
    subtotal: z.string(),
    subtotal_tax: z.string(),
    total: z.string(),
    tax: z.string(),
  }),
  variation: z
    .array(
      z.object({
        attribute: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  image: z
    .object({
      id: z.number().optional(),
      src: z.string(),
      alt: z.string().optional(),
    })
    .optional(),
});

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  item_count: z.number(),
  items_weight: z.number().optional(),
  needs_shipping: z.boolean().optional(),
  totals: z.object({
    subtotal: z.string(),
    subtotal_tax: z.string(),
    total: z.string(),
    tax: z.string(),
  }),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
