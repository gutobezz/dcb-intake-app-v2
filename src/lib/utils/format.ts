/**
 * Format a number or string as a USD price.
 * Handles numeric values, strings like "150000", and pre-formatted strings like "$150,000".
 */
export function formatPrice(amount: number | string): string {
  if (typeof amount === "string") {
    // If already formatted (starts with $), return as-is
    if (amount.startsWith("$")) return amount;
    // Strip non-numeric chars except decimal point
    const cleaned = amount.replace(/[^0-9.]/g, "");
    if (!cleaned) return "$0";
    amount = parseFloat(cleaned);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string or Date object to a readable format.
 * Returns "March 2026" style for proposals, or "Mar 24, 2026" for shorter contexts.
 */
export function formatDate(
  date: string | Date,
  style: "long" | "short" = "short"
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "";

  if (style === "long") {
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a phone number string to (XXX) XXX-XXXX format.
 * Handles various input formats: 10 digits, with country code, with dashes/spaces.
 */
export function formatPhone(phone: string): string {
  // Strip everything except digits
  const digits = phone.replace(/\D/g, "");

  // Handle 11-digit numbers starting with 1 (US country code)
  const normalized = digits.length === 11 && digits.startsWith("1")
    ? digits.slice(1)
    : digits;

  if (normalized.length !== 10) {
    // Return original if we can't parse it
    return phone;
  }

  const area = normalized.slice(0, 3);
  const prefix = normalized.slice(3, 6);
  const line = normalized.slice(6, 10);

  return `(${area}) ${prefix}-${line}`;
}
