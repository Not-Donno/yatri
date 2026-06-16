import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "secret"
);

async function verify(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload;
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return NextResponse.next();
  }

  // No token → redirect login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const user = await verify(token);

    const role = user.role as string;

    // CUSTOMER protection
    if (
      pathname.startsWith("/customer") &&
      role !== "CUSTOMER"
    ) {
      return NextResponse.redirect(
        new URL("/mechanic/dashboard", req.url)
      );
    }

    // MECHANIC protection
    if (
      pathname.startsWith("/mechanic") &&
      role !== "MECHANIC"
    ) {
      return NextResponse.redirect(
        new URL("/customer/dashboard", req.url)
      );
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/customer/:path*", "/mechanic/:path*"],
};