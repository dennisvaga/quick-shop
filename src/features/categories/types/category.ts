import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  parent: z.number().optional(),
  description: z.string().optional(),
  display: z.string().optional(),
  image: z
    .object({
      id: z.number().optional(),
      src: z.union([z.string(), z.boolean()]).optional(),
      alt: z.string().optional(),
    })
    .nullable()
    .optional(),
  count: z.number().optional(),
});

export type Category = z.infer<typeof CategorySchema>;
