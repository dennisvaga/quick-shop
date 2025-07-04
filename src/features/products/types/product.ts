import { z } from "zod";

// Zod schema for runtime validation
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  permalink: z.string(),
  date_created: z.string(),
  price: z.string(),
  regular_price: z.string(),
  sale_price: z.string().optional(),
  description: z.string(),
  short_description: z.string(),
  categories: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string(),
    })
  ),
  images: z.array(
    z.object({
      id: z.number(),
      src: z.string(),
      alt: z.string().optional(),
    })
  ),
  attributes: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        options: z.array(z.string()),
      })
    )
    .optional(),
  variations: z.array(z.number()).optional(),
  // Add other fields as needed
});

// TypeScript type derived from the schema
export type Product = z.infer<typeof ProductSchema>;

// Simplified product type for listings
export type ProductSummary = Pick<
  Product,
  "id" | "name" | "slug" | "price" | "images" | "categories"
>;

// Product with enhanced image URLs (for components that need imageUrl)
export type ProductWithImageUrl = Product & {
  images: Array<{
    id: number;
    src: string;
    imageUrl: string; // Enhanced URL field
    alt?: string;
  }>;
  brand?: string; // Optional brand field
};
