import { cookies } from "next/headers";
import { cache } from "react";
import type { CurrentUser } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

/**
 * Lee la sesion en el servidor.
 *
 * La cookie es `httpOnly`, asi que solo el servidor de Next.js puede verla: el
 * navegador nunca tiene acceso al token. Se reenvia tal cual al backend, que es
 * quien decide si sigue siendo valida — aqui no se verifica ninguna firma,
 * porque validar en dos sitios distintos es la forma segura de que un dia dejen
 * de coincidir.
 *
 * `cache` de React evita que varias llamadas dentro del mismo render se
 * traduzcan en varias peticiones al backend.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const cookieStore = await cookies();
  const header = cookieStore.toString();

  if (!header) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { cookie: header, Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as CurrentUser;
  } catch {
    // El backend caido no debe romper el render: se trata como sesion ausente
    // y el usuario acaba en el login, que explica que pasa.
    return null;
  }
});

/** Comprobacion de permisos para decidir que se muestra. Nunca para autorizar. */
export function hasPermission(user: CurrentUser | null, permission: string): boolean {
  return user?.permissions.includes(permission) ?? false;
}

export function hasAnyPermission(user: CurrentUser | null, permissions: string[]): boolean {
  return permissions.some((permission) => hasPermission(user, permission));
}
