export const SALON_DISCOUNT_TIERS = [
  { id: 'p20', percent: 20, label: '20%' },
  { id: 'ep', percent: 15, label: '15%' },
  { id: 'et', percent: 15, label: '15%' },
  { id: 'es', percent: 10, label: '10%' },
  { id: 'p5', percent: 5, label: '5%' },
  { id: 'p0', percent: 0, label: '0%' },
] as const;

export const SALON_DISCOUNT_PERCENTS = [20, 15, 10, 5, 0] as const;

export type SalonDiscountTierId = (typeof SALON_DISCOUNT_TIERS)[number]['id'];

const LEGACY_TIER: Record<string, SalonDiscountTierId> = {
  top20: 'p20',
  gold15: 'ep',
  contract15: 'et',
  vip5: 'p5',
  other: 'p0',
};

export function salonDiscountTier(id?: string | null) {
  if (!id) return null;
  const mapped = LEGACY_TIER[id] || id;
  return SALON_DISCOUNT_TIERS.find((tier) => tier.id === mapped) || null;
}

export function salonDiscountPercent(id?: string | null) {
  return salonDiscountTier(id)?.percent ?? 0;
}

export function tierIdForPercent(percent: number): SalonDiscountTierId {
  if (percent === 20) return 'p20';
  if (percent === 10) return 'es';
  if (percent === 5) return 'p5';
  if (percent === 0) return 'p0';
  return 'et';
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
