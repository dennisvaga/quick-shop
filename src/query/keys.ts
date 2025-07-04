/**
 * Query key factory for consistent cache organization
 * SHARED: Same query keys ensure cache consistency across platforms
 */
export const queryKeys = {
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters?: any) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.products.details(), id] as const,
    variations: (id: string | number) =>
      [...queryKeys.products.detail(id), "variations"] as const,
    search: (query: string) =>
      [...queryKeys.products.all, "search", query] as const,
    infinite: (filters?: any) =>
      [...queryKeys.products.all, "infinite", filters] as const,
    related: (id: string | number) =>
      [...queryKeys.products.detail(id), "related"] as const,
    featured: () => [...queryKeys.products.all, "featured"] as const,
  },

  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (filters?: any) =>
      [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.categories.details(), id] as const,
    tree: () => [...queryKeys.categories.all, "tree"] as const,
  },

  cart: {
    all: ["cart"] as const,
    current: () => [...queryKeys.cart.all, "current"] as const,
    count: () => [...queryKeys.cart.all, "count"] as const,
  },

  content: {
    all: ["content"] as const,
    banners: () => [...queryKeys.content.all, "banners"] as const,
    pages: () => [...queryKeys.content.all, "pages"] as const,
    page: (slug: string) => [...queryKeys.content.pages(), slug] as const,
  },
} as const;
