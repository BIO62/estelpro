export type AccountKind = 'consumer' | 'salon' | 'staff';
export type StaffRole = 'owner' | 'director' | 'manager' | 'operator';
export type UserRole = 'consumer' | 'salon' | StaffRole;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  lastName?: string;
  phone?: string;
  salonName?: string;
  salonCode?: string;
  address?: string;
  city?: string;
  district?: string;
  position?: string;
  discountPercent?: number;
  discountTier?: string;
  discountLabel?: string;
  kind: AccountKind;
  role: UserRole;
  passwordHash: string;
  verified: boolean;
  createdAt: string;
};

export type PublicUser = Omit<AuthUser, 'passwordHash'>;

export type OtpRecord = {
  email: string;
  code: string;
  purpose: 'register' | 'login' | 'reset_password';
  expiresAt: number;
};

export type AuthDb = {
  users: AuthUser[];
  otps: OtpRecord[];
};
