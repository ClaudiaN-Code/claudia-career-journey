import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasPassword: !!process.env.ADMIN_PASSWORD,
    passwordLength: process.env.ADMIN_PASSWORD?.length ?? 0,
    hasSecret: !!process.env.ADMIN_SECRET,
    hasToken: !!process.env.GITHUB_TOKEN,
  });
}
