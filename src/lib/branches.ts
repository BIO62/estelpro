export type BranchCity = 'ulaanbaatar' | 'erdenet' | 'darkhan';

export type BranchServiceLogo = {
  src: string;
  alt: string;
};

export type BranchService = {
  id: string;
  title: string;
  subtitle: string;
  active: boolean;
  logos?: BranchServiceLogo[];
};

export type Branch = {
  id: string;
  city: BranchCity;
  name: string;
  district: string;
  address: string;
  hours: string;
  phone: string;
  image: string;
  gallery?: string[];
  description: string;
  services?: BranchService[];
  /** Pin байрлал — Google Maps дээр газраа дарж координат хуулж энд засна */
  lat: number;
  lng: number;
};

export const DEFAULT_BRANCH_ID = 'ikh-delguur';

const BRANCH_SERVICE_LOYALTY: BranchService = {
  id: 'loyalty',
  title: 'Loyalty цуглуулах',
  subtitle: 'Урамшуулал эдлэх',
  active: true,
};

const BRANCH_SERVICE_COLORING: BranchService = {
  id: 'coloring-diagnosis',
  title: 'Хуйх, оношилгоо',
  subtitle: 'Ганцаарчилсан үйлчилгээ',
  active: true,
};

const BRANCH_SERVICE_ADVICE: BranchService = {
  id: 'advice',
  title: 'Бүтээгдэхүүний зөвлөгөө',
  subtitle: 'Мэргэжилийн',
  active: true,
};

const BRANCH_SERVICE_PAY: BranchService = {
  id: 'pay',
  title: 'Sono, Pocket, Store pay',
  subtitle: 'Зээлийн хэрэгсэл',
  active: true,
  logos: [
    { src: '/images/payments/sono.png', alt: 'Sono' },
    { src: '/images/payments/pocket.png', alt: 'Pocket' },
    { src: '/images/payments/storepay.png', alt: 'StorePay' },
  ],
};

/**
 * ESTEL борлуулалтын салбарууд.
 *
 * Pin байрлал өөрчлөх:
 * 1. Google Maps нээж салбарын байршлыг олох
 * 2. Газар дээр баруун товш → координат хуулах
 * 3. Доорх тухайн салбарын `lat`, `lng` утгыг солих
 *
 * Шинэ салбар: жагсаалтад шинэ объект нэмнэ.
 */
export const BRANCHES: Branch[] = [
  {
    id: 'ikh-delguur',
    city: 'ulaanbaatar',
    name: 'Их дэлгүүр',
    district: 'Улаанбаатар',
    address: '1 давхарт',
    hours: 'Даваа - Ням: 09:00 - 22:00',
    phone: '8603 7202',
    image: '/images/branches/ikh-delguur.jpg',
    description: 'Их дэлгүүрийн 1 давхарт ESTEL борлуулалтын цэг.',
    lat: 47.916943073635316,
    lng: 106.9060287949816,
  },
  {
    id: 'emart-10th',
    city: 'ulaanbaatar',
    name: '10-р хороололын Emart',
    district: 'Улаанбаатар',
    address: '3 давхарт',
    hours: 'Даваа - Ням: 10:00 - 22:00',
    phone: '8605 7202',
    image: '/images/branches/emart-10th.jpg',
    description: '10-р хороололын И-март худалдааны төвийн 3 давхарт.',
    lat: 47.91486945666231,
    lng: 106.87265390420202,
  },
  {
    id: 'sumang-plaza',
    city: 'ulaanbaatar',
    name: 'Соманг плаза',
    district: 'Улаанбаатар',
    address: '3 давхарт',
    hours: 'Даваа - Ням: 09:00 - 18:00',
    phone: '7707 2207',
    image: 'images/demo/branch1.jpg',
    description: 'Соманг плазын 3 давхарт ESTEL борлуулалтын цэг.',
    lat: 47.9183487144378,
    lng: 106.94153388702046,
  },
  {
    id: 'emart-chinggis',
    city: 'ulaanbaatar',
    name: 'Чингисийн Emart',
    district: 'Улаанбаатар',
    address: '2 давхарт',
    hours: 'Даваа - Ням: 10:00 - 22:00',
    phone: '8605 7202',
    image: '/images/branches/emart-chinggis.jpg',
    description: 'Чингисийн И-март худалдааны төвийн 2 давхарт.',
    lat: 47.92307361005366,
    lng: 106.93391195224075,
  },
  {
    id: 'tara-center',
    city: 'ulaanbaatar',
    name: 'Тара центр',
    district: 'Улаанбаатар',
    address: '2 давхар, B-227',
    hours: 'Даваа - Ням: 10:00 - 20:00',
    phone: '7707 2207',
    image: '/images/branches/tara-center.jpg',
    description: 'Тара центр худалдааны төвийн 2 давхар, B-227 тоот.',
    lat: 47.9139,
    lng: 106.9056,
  },
  {
    id: 'erdenet-orkhon',
    city: 'erdenet',
    name: 'Эрдэнэт — Орхон молл',
    district: 'Эрдэнэт',
    address: '2 давхарт',
    hours: 'Даваа - Ням: 10:00 - 22:00',
    phone: '7707 2207',
    image: 'images/demo/branch3.jpg',
    description: 'Эрдэнэт хот, Орхон молл худалдааны төвийн 2 давхарт.',
    lat: 49.03021507516695,
    lng: 104.03624711764989,
  },
  {
    id: 'darkhan-amu',
    city: 'darkhan',
    name: 'Дархан — Аму молл',
    district: 'Дархан',
    address: 'Аму молл',
    hours: 'Даваа - Ням: 10:00 - 22:00',
    phone: '7707 2207',
    image: '/images/branches/darkhan-amu.jpg',
    description: 'Дархан хот, Аму молл худалдааны төв.',
    lat: 49.46580871068577,
    lng: 105.9564655893335,
  },
];

const CITY_LABEL: Record<BranchCity, string> = {
  ulaanbaatar: 'Улаанбаатар',
  erdenet: 'Эрдэнэт',
  darkhan: 'Дархан',
};

export function branchCityLabel(city: BranchCity) {
  return CITY_LABEL[city];
}

export function listBranches() {
  return BRANCHES;
}

/** Нүүр хуудсын slider — зөвхөн УБ */
export function listUlaanbaatarBranches() {
  return BRANCHES.filter((branch) => branch.city === 'ulaanbaatar');
}

export function getBranchById(id: string) {
  return BRANCHES.find((branch) => branch.id === id) || null;
}

export function branchFullAddress(branch: Branch) {
  const city = branchCityLabel(branch.city);
  const parts = [city];

  if (branch.district && branch.district !== city) {
    parts.push(branch.district);
  }

  if (branch.address) {
    parts.push(branch.address);
  }

  return parts.join(' · ');
}

export function branchGallery(branch: Branch) {
  return branch.gallery?.length ? branch.gallery : [branch.image];
}

export function branchServices(branch: Branch) {
  if (branch.services?.length) return branch.services;

  const services = [
    BRANCH_SERVICE_LOYALTY,
    ...(branch.id !== 'tara-center' ? [BRANCH_SERVICE_COLORING] : []),
    BRANCH_SERVICE_ADVICE,
    BRANCH_SERVICE_PAY,
  ];

  return services;
}

export function branchDirectionsUrl(branch: Branch) {
  return `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;
}

export function branchGoogleMapsUrl(branch: Branch) {
  return `https://www.google.com/maps/search/?api=1&query=${branch.lat},${branch.lng}`;
}

export const HELP_NAV_LINKS = [
  { href: '/about', label: 'Бидний тухай' },
  { href: '/branches', label: 'Салбарууд' },
  { href: '/terms', label: 'Үйлчилгээний нөхцөл' },
  { href: '/terms/delivery', label: 'Хүргэлтийн нөхцөл' },
  { href: '/terms/payment', label: 'Төлбөрийн нөхцөл' },
] as const;
