import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  // public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return NextResponse.next();
  }

  // no token → login
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  // ROLE CHECK (call backend)
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    const user = await res.json();

    // CUSTOMER route protection
    if (
      pathname.startsWith("/customer") &&
      user.role !== "CUSTOMER"
    ) {
      return NextResponse.redirect(
        new URL("/mechanic/dashboard", req.url)
      );
    }

    // MECHANIC route protection
    if (
      pathname.startsWith("/mechanic") &&
      user.role !== "MECHANIC"
    ) {
      return NextResponse.redirect(
        new URL("/customer/dashboard", req.url)
      );
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }
}

export const config = {
  matcher: [
    "/customer/:path*",
    "/mechanic/:path*",
  ],
};