/**
 * Format a price string with currency symbol
 * @param price - Price as string or number
 * @param currencySymbol - Currency symbol to use (default: ₪)
 * @param position - Position of the currency symbol (default: before)
 * @returns Formatted price string
 */
export function formatPrice(
  price: string | number,
  currencySymbol = "₪",
  position: "before" | "after" = "before"
): string {
  // Convert to number if it's a string
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  // Format with 2 decimal places
  const formattedPrice = numericPrice.toFixed(2);

  // Remove trailing zeros and decimal point if no decimal places
  const cleanPrice = formattedPrice.replace(/\.00$/, "");

  // Return formatted price with currency symbol
  return position === "before"
    ? `${currencySymbol}${cleanPrice}`
    : `${cleanPrice} ${currencySymbol}`;
}

/**
 * Convert a string to a URL-friendly slug
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 * Truncate text to a specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @param suffix - Suffix to add to truncated text (default: ...)
 * @returns Truncated text
 */
export function truncateText(
  text: string,
  length: number,
  suffix = "..."
): string {
  if (text.length <= length) {
    return text;
  }

  return text.substring(0, length).trim() + suffix;
}
