export const SYLIUS_BASE_URL = process.env.NEXT_PUBLIC_SYLIUS_URL || 'https://estel.nextstore.mn';

export interface SyliusImage {
  id: number;
  type?: string;
  originalImagePath?: string;
  medium?: string;
  thumbnail?: string;
}

export interface SyliusVariant {
  id: number;
  code: string;
  name?: string | null;
  price: number;
  originalPrice?: number;
  inStock?: boolean;
}

export interface SyliusTaxon {
  id: number;
  code: string;
  name: string;
  slug?: string;
  enabled?: boolean;
  enabledChildren?: SyliusTaxon[];
}

export interface SyliusProduct {
  id: number;
  code: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  images: SyliusImage[];
  variants: SyliusVariant[];
  brand?: {
    id: number;
    code: string;
    name: string;
  };
  mainTaxon?: {
    id: number;
    code: string;
    name: string;
  };
}

/**
 * Fetch all products or filter by category/taxon code
 */
export async function getSyliusProducts(options?: {
  taxonCode?: string;
  page?: number;
  itemsPerPage?: number;
}): Promise<SyliusProduct[]> {
  try {
    const params = new URLSearchParams();
    if (options?.taxonCode) {
      params.append('productTaxons.taxon.code', options.taxonCode);
    }
    if (options?.page) {
      params.append('page', options.page.toString());
    }
    if (options?.itemsPerPage) {
      params.append('itemsPerPage', options.itemsPerPage.toString());
    }

    const queryString = params.toString();
    const url = `${SYLIUS_BASE_URL}/api/v2/shop/products${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds (ISR)
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch Sylius products:', res.statusText);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data['hydra:member'] || [];
  } catch (error) {
    console.error('Error fetching Sylius products:', error);
    return [];
  }
}

/**
 * Fetch a single product by code or slug
 */
export async function getSyliusProductByCode(code: string): Promise<SyliusProduct | null> {
  try {
    const res = await fetch(`${SYLIUS_BASE_URL}/api/v2/shop/products/${code}`, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Error fetching Sylius product ${code}:`, error);
    return null;
  }
}

/**
 * Fetch category / taxon tree
 */
export async function getSyliusTaxons(): Promise<SyliusTaxon[]> {
  try {
    const res = await fetch(`${SYLIUS_BASE_URL}/api/v2/shop/taxons`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching Sylius taxons:', error);
    return [];
  }
}

/**
 * Helper to get clean price in MNT from Sylius integer price (cents to MNT)
 */
export function formatSyliusPrice(priceInCents: number): string {
  // Sylius stores price as integer in cents e.g. 7040000 -> 70,400₮ or 70400 -> 70,400₮
  const actualPrice = priceInCents > 1000000 ? priceInCents / 100 : priceInCents;
  return new Intl.NumberFormat('mn-MN').format(actualPrice) + ' ₮';
}
