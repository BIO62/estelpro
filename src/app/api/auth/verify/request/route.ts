import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Хэрэглэгчийн имэйл OTP энэ урсгалд ашиглагдахгүй.' },
    { status: 410 },
  );
}
