import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { hashPassword } from './password';
import type { AuthDb, AuthUser, OtpRecord } from './types';

const FILE = path.join(process.cwd(), 'data', 'auth.json');

export function normalizeSalonCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, '');
}

function demoSalon(): AuthUser {
  return {
    id: 'salon-demo',
    email: 'salon@estel.mn',
    name: 'ESTEL Demo Salon',
    salonName: 'ESTEL Demo',
    salonCode: 'SLN-1001',
    kind: 'salon',
    role: 'salon',
    passwordHash: hashPassword(randomBytes(12).toString('hex')),
    verified: true,
    createdAt: new Date().toISOString(),
  };
}

function seed(): AuthDb {
  return {
    users: [
      {
        id: 'staff-manager',
        email: 'manager@estel.mn',
        name: 'Менежер',
        kind: 'staff',
        role: 'manager',
        passwordHash: hashPassword('estel123'),
        verified: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'staff-operator',
        email: 'operator@estel.mn',
        name: 'Оператор',
        kind: 'staff',
        role: 'operator',
        passwordHash: hashPassword('estel123'),
        verified: true,
        createdAt: new Date().toISOString(),
      },
      demoSalon(),
    ],
    otps: [],
  };
}

function ensureDemoSalon(db: AuthDb) {
  if (!db.users.some((user) => user.kind === 'salon' && user.salonCode)) {
    db.users.push(demoSalon());
    writeDb(db);
  }
  return db;
}

function readDb(): AuthDb {
  try {
    return ensureDemoSalon(JSON.parse(readFileSync(FILE, 'utf8')) as AuthDb);
  } catch {
    const db = seed();
    writeDb(db);
    return db;
  }
}

function writeDb(db: AuthDb) {
  mkdirSync(path.dirname(FILE), { recursive: true });
  writeFileSync(FILE, JSON.stringify(db, null, 2), 'utf8');
}

export function listUsers() {
  return readDb().users;
}

export function findUserByEmail(email: string) {
  return readDb().users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export function findUserByPhone(phone: string) {
  const digits = phone.replace(/\D/g, '').slice(-8);
  if (digits.length !== 8) return null;
  return readDb().users.find((user) => user.phone && user.phone.replace(/\D/g, '').slice(-8) === digits) || null;
}

export function findUserBySalonCode(code: string) {
  const normalized = normalizeSalonCode(code);
  return readDb().users.find((user) => user.salonCode && normalizeSalonCode(user.salonCode) === normalized) || null;
}

export function saveUser(user: AuthUser) {
  const db = readDb();
  const index = db.users.findIndex((item) => item.id === user.id);
  if (index >= 0) db.users[index] = user;
  else db.users.push(user);
  writeDb(db);
  return user;
}

export function saveUsers(users: AuthUser[]) {
  const db = readDb();
  for (const user of users) {
    const index = db.users.findIndex((item) => item.id === user.id);
    if (index >= 0) db.users[index] = user;
    else db.users.push(user);
  }
  writeDb(db);
  return users.length;
}

export function listSalons() {
  return readDb().users.filter((user) => user.kind === 'salon');
}

export function saveOtp(record: OtpRecord) {
  const db = readDb();
  db.otps = db.otps.filter((item) => item.email !== record.email || item.purpose !== record.purpose);
  db.otps.push(record);
  writeDb(db);
}

export function takeOtp(email: string, purpose: OtpRecord['purpose'], code: string) {
  const db = readDb();
  const now = Date.now();
  const match = db.otps.find(
    (item) =>
      item.email.toLowerCase() === email.toLowerCase() &&
      item.purpose === purpose &&
      item.code === code &&
      item.expiresAt > now
  );
  if (!match) return false;
  db.otps = db.otps.filter((item) => item !== match);
  writeDb(db);
  return true;
}

export function toPublicUser(user: AuthUser) {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}
