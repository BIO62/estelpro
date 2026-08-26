export type HairConcernTone = 'pink' | 'coral' | 'teal' | 'mauve' | 'peach' | 'mint' | 'gold' | 'lilac';

export type HairConcern = {
  code: string;
  label: string;
  tone: HairConcernTone;
};

const RULES: { code: string; label: string; tone: HairConcernTone; keys: string[] }[] = [
  { code: 'dry', label: 'ХУУРАЙ ҮСЭНД', tone: 'coral', keys: ['хуурай', 'dry', 'nutritive', 'aqua', 'hydrat', 'moisture', 'satin'] },
  { code: 'weak', label: 'СУЛ ҮСЭНД', tone: 'pink', keys: ['сул', 'weak', 'genesis', 'fortif', 'repair', 'absolut', 'гэмт', 'хэврэг'] },
  { code: 'color', label: 'БУДАГТАЙ ҮСЭНД', tone: 'mauve', keys: ['будаг', 'колор', 'koleston', 'anti-yellow', 'color_off', 'буурал', 'essex'] },
  { code: 'over', label: 'ГЭМТЭЛТЭЙ ҮСЭНД', tone: 'teal', keys: ['xtro', 'bleach', 'blonde', 'ойлголт', 'blond'] },
  { code: 'frizz', label: 'ХЭВТЭРСЭН ҮСЭНД', tone: 'peach', keys: ['хэвтэр', 'frizz', 'curl', 'smooth', 'tame'] },
  { code: 'scalp', label: 'ТОЛИГОЙД', tone: 'mint', keys: ['толиг', 'scalp', 'dandruff', 'sebum'] },
  { code: 'kids', label: 'ХҮҮХДЭД', tone: 'gold', keys: ['хүүхэд', 'kids', 'baby', 'little me'] },
  { code: 'styling', label: 'ХЭЛБЭРЖҮҮЛЭЛТ', tone: 'lilac', keys: ['хэлбэр', 'styling', 'мус', 'лак', 'гель', 'mousse', 'вакс', 'wax'] },
  { code: 'oral', label: 'ШҮДЭНД', tone: 'teal', keys: ['шүд', 'оо,', 'toothpaste'] },
  { code: 'body', label: 'АРЬС & БИЕ', tone: 'mint', keys: ['арьс', 'бие', 'skin', 'body', 'душ', 'peeling', 'сахл'] },
  { code: 'hair', label: 'ҮСЭНД', tone: 'pink', keys: ['шампунь', 'shampoo', 'ангижруулагч', 'маск', 'серум', 'тоник'] },
];

const NO_BADGE = /багс|brush|каталог|catalogue|bowl|accessories|аксессуар/;

function isSlug(value: string) {
  return !value || /^[a-z0-9_]+$/i.test(value);
}

export function hairConcernFor(input: { name?: string; category?: string }): HairConcern | null {
  const name = (input.name || '').trim();
  const category = (input.category || '').trim();
  if (NO_BADGE.test(name.toLowerCase())) return null;

  const haystack = `${name} ${isSlug(category) ? '' : category}`.toLowerCase();
  const hit = RULES.find((rule) => rule.keys.some((key) => haystack.includes(key)));
  if (hit) return { code: hit.code, label: hit.label, tone: hit.tone };
  if (isSlug(category)) return null;

  return {
    code: 'cat',
    label: category.toUpperCase(),
    tone: 'mauve',
  };
}
