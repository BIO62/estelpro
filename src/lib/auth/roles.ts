import type { StaffRole, UserRole } from './types';

export const STAFF_ROLES = ['owner', 'director', 'manager', 'operator'] as const;

export const STAFF_POSITIONS = [
  { value: 'ceo', label: 'Гүйцэтгэх захирал (CEO)' },
  { value: 'cfo', label: 'Санхүүгийн захирал (CFO)' },
  { value: 'sales_director', label: 'Борлуулалтын захирал (Sales Director)' },
  { value: 'coo', label: 'Үйл ажиллагаа хариуцсан захирал (COO)' },
  { value: 'cofounder', label: 'Хамтран үүсгэн байгуулагч / ТУЗ' },
  { value: 'manager', label: 'Менежер' },
  { value: 'operator', label: 'Оператор' },
] as const;

export function isStaffRole(role?: string | null): role is (typeof STAFF_ROLES)[number] {
  return STAFF_ROLES.includes(role as (typeof STAFF_ROLES)[number]);
}

export function isLeadershipRole(role?: string | null) {
  return role === 'owner' || role === 'director';
}

export function canManageStaff(role?: UserRole | null) {
  return isLeadershipRole(role);
}

export function canManageSalons(role?: UserRole | null) {
  return isLeadershipRole(role);
}

export function canViewAdminReports(role?: UserRole | null) {
  return isStaffRole(role) && role !== 'operator';
}

export function canViewActivityLog(role?: UserRole | null) {
  return canViewAdminReports(role);
}

export function canViewSiteUsers(role?: UserRole | null) {
  return canViewAdminReports(role);
}

export function canDeleteUsers(role?: UserRole | null) {
  return isLeadershipRole(role);
}

export function canInviteDirectors(role?: UserRole | null) {
  return role === 'owner';
}

export function canDeleteStaffTarget(
  actor: { id: string; role: UserRole },
  target: { id: string; role: UserRole },
  ownerCount: number,
) {
  if (!canManageStaff(actor.role)) return false;
  if (target.id === actor.id) {
    return actor.role === 'owner' && ownerCount > 1;
  }
  if (target.role === 'owner') return false;
  if (target.role === 'director') return actor.role === 'owner';
  return true;
}

export const OWNER_EMAIL = 'director@estel.mn';

export function resolveStaffRole(email?: string | null, role?: string | null): UserRole {
  if (email?.trim().toLowerCase() === OWNER_EMAIL) return 'owner';
  return (role as UserRole) || 'consumer';
}

export function roleLabel(role?: string | null) {
  if (role === 'owner') return 'Ерөнхий захирал';
  if (role === 'director') return 'Захирал';
  if (role === 'manager') return 'Менежер';
  if (role === 'operator') return 'Оператор';
  if (role === 'salon') return 'Салон';
  return 'Хэрэглэгч';
}

export function positionLabel(position?: string | null) {
  const hit = STAFF_POSITIONS.find((item) => item.value === position);
  return hit?.label || position || '';
}

export function parseInviteRole(raw: string | undefined, actorRole: UserRole): StaffRole {
  if (raw === 'director' && canInviteDirectors(actorRole)) return 'director';
  if (raw === 'operator') return 'operator';
  if (raw === 'manager') return 'manager';
  return 'operator';
}
