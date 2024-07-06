import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function middleware(request: NextRequest) {
  // update supabase session
  await updateSession(request);
  // check if user is authenticated, if not redirect to login
  const stytchSessionJWT = request.cookies.get("stytch_session_jwt");

  // Bypass middleware for the base URL or adjust as needed for your login page
  const url = new URL(request.url);
  if (
    url.pathname === "/" ||
    url.pathname === "/login" ||
    url.href.includes("stytch_token")
  ) {
    return NextResponse.next();
  }

  if (!stytchSessionJWT) {
    console.log("No session found, redirecting to login");
    return NextResponse.redirect(new URL("/", BASE_URL));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!next-api|_next/static|_next/image|images|favicon.ico|api/).*)",
};
