import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { checkAdminAccess } from "@/lib/auth/admin-guard";
import {
  getSafeAdminRedirect,
  isAdminApiRoute,
  isAdminProtectedRoute,
  isAdminPublicRoute,
} from "@/lib/auth/admin-routes";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function applyNoStoreHeaders(response: NextResponse) {
  Object.entries(NO_STORE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (isAdminPublicRoute(pathname)) {
    if (user) {
      const access = await checkAdminAccess(supabase, user);
      if (access.ok) {
        const url = request.nextUrl.clone();
        url.pathname = getSafeAdminRedirect(url.searchParams.get("redirect"));
        url.search = "";
        return applyNoStoreHeaders(NextResponse.redirect(url));
      }
    }
    return applyNoStoreHeaders(supabaseResponse);
  }

  if (isAdminProtectedRoute(pathname) || isAdminApiRoute(pathname)) {
    const access = await checkAdminAccess(supabase, user);

    if (!access.ok) {
      if (isAdminApiRoute(pathname)) {
        const status = access.reason === "unauthenticated" ? 401 : 403;
        return NextResponse.json(
          { error: status === 401 ? "Unauthorized" : "Forbidden" },
          { status }
        );
      }

      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";

      if (access.reason === "unauthenticated") {
        url.searchParams.set("redirect", pathname);
      } else {
        url.searchParams.set("error", "forbidden");
      }

      return applyNoStoreHeaders(NextResponse.redirect(url));
    }

    return applyNoStoreHeaders(supabaseResponse);
  }

  if (
    (pathname.startsWith("/account") ||
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/orders")) &&
    !user
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
