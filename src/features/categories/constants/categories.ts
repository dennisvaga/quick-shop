// Category constants for quick-shop mobile app
// Maps display categories to actual WooCommerce category IDs and slugs

export const APP_CATEGORIES = {
  special: [
    {
      id: "sale",
      name: "SALE",
      wooId: 34,
      slug: "sale",
    },
    {
      id: "new-collection",
      name: "NEW COLLECTION",
      wooId: 92,
      slug: "new-collection",
    },
  ],
  main: [
    {
      id: "jeans",
      name: "ג'ינסים",
      wooId: 28,
      slug: "jeans",
    },
    {
      id: "pants",
      name: "מכנסיים",
      wooId: 93,
      slug: "%d7%9e%d7%9b%d7%a0%d7%a1%d7%99%d7%99%d7%9d",
      subcategories: [
        {
          id: "leather",
          name: "עור",
          wooId: 85,
          slug: "skin",
        },
        {
          id: "cotton",
          name: "כותנה",
          wooId: 30,
          slug: "cotton-pants",
        },
        {
          id: "shorts",
          name: "קצרים",
          wooId: 86,
          slug: "shorts-jeans",
        },
        {
          id: "shorts2",
          name: "שורטים",
          wooId: 33,
          slug: "shorts",
        },
        {
          id: "skinny",
          name: "סקיני",
          wooId: 61,
          slug: "skinny",
        },
        {
          id: "tailored",
          name: "מחויטים",
          wooId: 29,
          slug: "tailored-pants",
        },
        {
          id: "flare",
          name: "פלייר",
          wooId: 62,
          slug: "flare",
        },
      ],
    },
    {
      id: "shirts",
      name: "חולצות",
      wooId: 160,
      slug: "%d7%97%d7%95%d7%9c%d7%a6%d7%95%d7%aa",
    },
    {
      id: "tanks",
      name: "גופיות",
      wooId: 161,
      slug: "%d7%92%d7%95%d7%a4%d7%99%d7%95%d7%aa",
    },
    {
      id: "vests",
      name: "ווסטים",
      wooId: 95,
      slug: "%d7%95%d7%95%d7%a1%d7%98%d7%99%d7%9d",
    },
    {
      id: "dresses",
      name: "שמלות ואוברולים",
      wooId: 162,
      slug: "%d7%a9%d7%9e%d7%9c%d7%95%d7%aa",
    },
    {
      id: "buttoned",
      name: "מכופתרות",
      wooId: 166,
      slug: "%d7%9e%d7%9b%d7%95%d7%a4%d7%aa%d7%a8%d7%95%d7%aa",
    },
    {
      id: "flip-flops",
      name: "כפכפים",
      wooId: 163,
      slug: "%d7%9b%d7%a4%d7%9b%d7%a4%d7%99%d7%9d",
    },
  ],
};

// Helper function to get all category IDs for API fetching
export const getAllAppCategoryIds = (): number[] => {
  const specialIds = APP_CATEGORIES.special.map((c) => c.wooId);
  const mainIds = APP_CATEGORIES.main.map((c) => c.wooId);
  const subcategoryIds = APP_CATEGORIES.main.flatMap(
    (c) => c.subcategories?.map((sub) => sub.wooId) || []
  );

  return [...specialIds, ...mainIds, ...subcategoryIds];
};

// Helper function to get category by ID
export const getCategoryById = (id: string) => {
  // Check special categories
  const special = APP_CATEGORIES.special.find((c) => c.id === id);
  if (special) return special;

  // Check main categories
  const main = APP_CATEGORIES.main.find((c) => c.id === id);
  if (main) return main;

  // Check subcategories
  for (const category of APP_CATEGORIES.main) {
    if (category.subcategories) {
      const subcategory = category.subcategories.find((sub) => sub.id === id);
      if (subcategory) return subcategory;
    }
  }

  return null;
};

// Helper function to get category by WooCommerce ID
export const getCategoryByWooId = (wooId: number) => {
  // Check special categories
  const special = APP_CATEGORIES.special.find((c) => c.wooId === wooId);
  if (special) return special;

  // Check main categories
  const main = APP_CATEGORIES.main.find((c) => c.wooId === wooId);
  if (main) return main;

  // Check subcategories
  for (const category of APP_CATEGORIES.main) {
    if (category.subcategories) {
      const subcategory = category.subcategories.find(
        (sub) => sub.wooId === wooId
      );
      if (subcategory) return subcategory;
    }
  }

  return null;
};
