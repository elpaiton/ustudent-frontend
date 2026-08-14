import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "ustudent_access";

/**
 * Comprobacion optimista de sesion. En Next.js 16 esto era `middleware.ts`.
 *
 * Solo mira si la cookie existe, para evitar renderizar el area privada a
 * quien claramente no ha entrado. **No es la autorizacion**: la cookie puede
 * estar vencida o revocada, y eso solo lo sabe el backend. La comprobacion de
 * verdad la hace el layout del area autenticada contra `/auth/me`, y por
 * encima de todo el propio servidor en cada endpoint.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(ACCESS_COOKIE);

  if (!hasSession && isProtected(pathname)) {
    const login = new URL("/login", request.url);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

function isProtected(pathname: string): boolean {
  return ["/dashboard", "/estudiante", "/docente", "/admin"].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export const config = {
  matcher: ["/dashboard/:path*", "/estudiante/:path*", "/docente/:path*", "/admin/:path*"],
};
