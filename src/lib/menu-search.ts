/**
 * Sanitize search terms for PostgREST .or() filters.
 * Commas break OR clauses; % and _ are wildcards in SQL ILIKE.
 */
export function sanitizeSearchTerm(term: string): string {
  return term.trim().replace(/[%_,]/g, "").slice(0, 100);
}

export function isValidSearchTerm(term: string | undefined | null): term is string {
  if (!term) return false;
  const sanitized = sanitizeSearchTerm(term);
  if (!sanitized) return false;
  // Header used to link to /menu?search=true — treat as empty search
  if (sanitized.toLowerCase() === "true") return false;
  return true;
}

export interface CategorySearchRef {
  id: string;
  name: string;
  slug: string;
}

/**
 * Build PostgREST .or() filter for product name, description, and category match.
 */
export function buildProductSearchFilter(
  term: string,
  categories: CategorySearchRef[]
): string {
  const sanitized = sanitizeSearchTerm(term);
  const pattern = `%${sanitized}%`;
  const lower = sanitized.toLowerCase();

  const matchingCategoryIds = categories
    .filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.slug.toLowerCase().includes(lower) ||
        c.slug.replace(/-/g, " ").includes(lower)
    )
    .map((c) => c.id);

  const parts = [
    `name.ilike.${pattern}`,
    `description.ilike.${pattern}`,
  ];

  if (matchingCategoryIds.length > 0) {
    parts.push(`category_id.in.(${matchingCategoryIds.join(",")})`);
  }

  return parts.join(",");
}
