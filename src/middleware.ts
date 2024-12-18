import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check for the UserID cookie
  const userID = req.cookies.get("UserID")?.value;

  // If the user is not logged in and tries to access the dashboard, redirect to login
  if (userID !== process.env.ID && pathname.startsWith("/dashboard")) {
    if (pathname !== "/dashboard/login") {
      const loginUrl = new URL("/dashboard/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If the user is logged in and tries to access the login page, redirect to dashboard
  if (userID === process.env.ID && pathname === "/dashboard/login") {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow the request if it doesn't match the above conditions
  return NextResponse.next();
}
