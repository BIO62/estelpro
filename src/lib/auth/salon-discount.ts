export const SALON_DISCOUNT_TIERS = [
  { id: 'ep', percent: 20, label: 'EP 20%' },
  { id: 'et', percent: 20, label: 'ET 20%' },
  { id: 'p15', percent: 15, label: '15%' },
  { id: 'es', percent: 10, label: '10%' },
  { id: 'p5', percent: 5, label: '5%' },
  { id: 'p0', percent: 0, label: '0%' },
] as const;

export const SALON_DISCOUNT_PERCENTS = [20, 15, 10, 5, 0] as const;

export type SalonDiscountTierId = (typeof SALON_DISCOUNT_TIERS)[number]['id'];

/**
 * Live DB check still only allows legacy ids.
 * Map logical tiers ↔ storage:
 *   ep → top20 (20%)
 *   et → contract15 (20%)
 *   p15 / es → gold15 (percent distinguishes 15 vs 10)
 *   p5 / p0 → vip5 (percent distinguishes 5 vs 0)
 */
const LEGACY_TO_LOGICAL: Record<string, SalonDiscountTierId> = {
  top20: 'ep',
  p20: 'ep',
  ep: 'ep',
  contract15: 'et',
  et: 'et',
  gold15: 'p15',
  p15: 'p15',
  es: 'es',
  vip5: 'p5',
  p5: 'p5',
  other: 'p0',
  p0: 'p0',
};

export function toDbDiscountTier(id: SalonDiscountTierId): string {
  if (id === 'ep') return 'top20';
  if (id === 'et') return 'contract15';
  if (id === 'p15' || id === 'es') return 'gold15';
  return 'vip5'; // p5, p0
}

export function salonDiscountTier(id?: string | null) {
  if (!id) return null;
  const mapped = LEGACY_TO_LOGICAL[id] || (id as SalonDiscountTierId);
  return SALON_DISCOUNT_TIERS.find((tier) => tier.id === mapped) || null;
}

export function resolveSalonDiscount(
  tierId?: string | null,
  percent?: number | null,
): { id: SalonDiscountTierId; percent: number } {
  const pct = Number(percent);
  const hasPct = [20, 15, 10, 5, 0].includes(pct);
  if (hasPct) {
    if (pct === 20) {
      const logical = (LEGACY_TO_LOGICAL[tierId || ''] || 'ep') as SalonDiscountTierId;
      const id: SalonDiscountTierId = logical === 'et' ? 'et' : 'ep';
      return { id, percent: 20 };
    }
    if (pct === 15) return { id: 'p15', percent: 15 };
    if (pct === 10) return { id: 'es', percent: 10 };
    if (pct === 5) return { id: 'p5', percent: 5 };
    return { id: 'p0', percent: 0 };
  }
  const tier = salonDiscountTier(tierId);
  return { id: (tier?.id || 'p0') as SalonDiscountTierId, percent: tier?.percent ?? 0 };
}

export function salonDiscountPercent(id?: string | null) {
  return salonDiscountTier(id)?.percent ?? 0;
}

export function tierIdForPercent(percent: number, currentTier?: string | null): SalonDiscountTierId {
  if (percent === 20) {
    const cur = LEGACY_TO_LOGICAL[currentTier || ''] || currentTier;
    if (cur === 'et' || cur === 'ep') return cur;
    return 'ep';
  }
  if (percent === 15) return 'p15';
  if (percent === 10) return 'es';
  if (percent === 5) return 'p5';
  return 'p0';
}

export function tierBadgeLabel(tier?: string | null, percent?: number) {
  const resolved = resolveSalonDiscount(tier, percent);
  if (resolved.id === 'ep') return 'EP 20%';
  if (resolved.id === 'et') return 'ET 20%';
  return `${resolved.percent}%`;
}

/**
 * Name rules:
 * - 1.EP / EP → 20% (ep)
 * - 1.ET / ET → 20% (et)
 * - 1.ES / ES → 10%
 * - /S салон/ / SILVER → 10%
 * - /G салон/ / GOLD → 15%
 * - ангиллын код 4. → 5%
 * - ангиллын код 1. (бусад) → 0%
 */
export function classifySalonDiscountFromName(name: string, categoryCode?: string | null) {
  const n = String(name || '');
  const code = String(categoryCode || '').trim();

  if (/\d+\.\s*EP\b|(^|[\s./])EP(\s|$)/i.test(n)) {
    return { discountTier: 'ep' as const, discountPercent: 20 };
  }
  if (/\d+\.\s*ET\b|(^|[\s./])ET(\s|$)/i.test(n)) {
    return { discountTier: 'et' as const, discountPercent: 20 };
  }
  if (/\d+\.\s*ES\b|(^|[\s./])ES(\s|$)/i.test(n)) {
    return { discountTier: 'es' as const, discountPercent: 10 };
  }
  if (/\/\s*S\b|\bSILVER\b/i.test(n)) {
    return { discountTier: 'es' as const, discountPercent: 10 };
  }
  if (/\/\s*G\b|\bGOLD\b/i.test(n)) {
    return { discountTier: 'p15' as const, discountPercent: 15 };
  }
  if (code === '4' || code === '004' || /^\s*4\./.test(n)) {
    return { discountTier: 'p5' as const, discountPercent: 5 };
  }
  if (code === '1' || code === '001' || /^\s*1\./.test(n)) {
    return { discountTier: 'p0' as const, discountPercent: 0 };
  }
  return { discountTier: 'p0' as const, discountPercent: 0 };
}

export function applySalonDiscount(amount: number, percent: number) {
  if (!percent) return Math.round(amount);
  return Math.round(amount * (1 - percent / 100));
}

/** Default salon password = last 8 digits of phone (or all digits). */
export function salonDefaultPassword(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-8) || digits;
}

export function matchesSalonPhonePassword(password: string, phone: string) {
  const passDigits = password.replace(/\D/g, '');
  const phoneDigits = phone.replace(/\D/g, '');
  if (!phoneDigits) return false;
  const candidate = passDigits || password.trim();
  if (!candidate) return false;
  return (
    candidate === phoneDigits ||
    candidate === phoneDigits.slice(-8) ||
    phoneDigits.endsWith(candidate) ||
    (candidate === password.trim() && password.trim() === phone.trim())
  );
}
