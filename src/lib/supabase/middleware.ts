import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { checkAdminAccess } from "@/lib/auth/admin-guard";

function isAdminPage(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminApi(pathname: string) {
  return pathname.startsWith("/api/admin/") || pathname.startsWith("/api/test/");
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

  if (isAdminPage(pathname) || isAdminApi(pathname)) {
    const access = await checkAdminAccess(supabase, user);

    if (!access.ok) {
      if (isAdminApi(pathname)) {
        const status = access.reason === "unauthenticated" ? 401 : 403;
        return NextResponse.json(
          { error: status === 401 ? "Unauthorized" : "Forbidden" },
          { status }
        );
      }

      if (access.reason === "unauthenticated") {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }

      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("error", "admin_forbidden");
      return NextResponse.redirect(url);
    }
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
