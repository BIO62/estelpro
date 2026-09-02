export const DRESSER_COOKIE = 'estel_dresser';

export const DRESSER_TAXON_CODES = ['hairdresser_category'] as const;

const DRESSER_SET = new Set<string>(DRESSER_TAXON_CODES);

export function isDresserTaxonCode(code?: string | null): boolean {
  if (!code) return false;
  return DRESSER_SET.has(code);
}

export function productTaxonCodes(product: {
  mainTaxon?: { code?: string | null } | null;
  productTaxons?: Array<{ taxon?: { code?: string | null } | null }> | null;
}): string[] {
  const codes = [product.mainTaxon?.code];
  for (const item of product.productTaxons || []) {
    codes.push(item?.taxon?.code);
  }
  return codes.filter((code): code is string => Boolean(code));
}

export function isDresserProduct(product: {
  mainTaxon?: { code?: string | null } | null;
  productTaxons?: Array<{ taxon?: { code?: string | null } | null }> | null;
}): boolean {
  return productTaxonCodes(product).some(isDresserTaxonCode);
}

export const CONSUMER_ROOT_TAXONS = ['hair_care', 'hair_coloring', 'skin_body', 'Alpha', 'kids_care', 'styling'] as const;

export function productRootCategory(product: {
  mainTaxon?: { code?: string | null } | null;
  productTaxons?: Array<{ taxon?: { code?: string | null } | null }> | null;
}): string {
  const codes = productTaxonCodes(product);
  return CONSUMER_ROOT_TAXONS.find((code) => codes.includes(code)) || product.mainTaxon?.code || '';
}
