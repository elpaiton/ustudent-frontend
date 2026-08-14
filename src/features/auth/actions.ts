"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ProblemDetail } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export interface LoginState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Inicia sesion contra el backend y traslada sus cookies al navegador.
 *
 * El backend es quien decide: aqui no se valida ninguna credencial ni se
 * inspecciona el token. Esta funcion solo hace de puente para que la cookie
 * `httpOnly` que emite la API acabe en el navegador del usuario.
 */
export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Escribe tu correo y tu contrasena." };
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return { error: "No pudimos contactar el servidor. Intenta de nuevo en un momento." };
  }

  if (!response.ok) {
    const problem: ProblemDetail = await response.json().catch(() => ({}));
    const fieldErrors = problem.errors?.reduce<Record<string, string>>((acc, item) => {
      acc[item.field] = item.message;
      return acc;
    }, {});
    return {
      error: problem.detail ?? "No pudimos iniciar tu sesion.",
      fieldErrors,
    };
  }

  await forwardAuthCookies(response);

  // redirect lanza una excepcion de control interna de Next: va fuera del
  // try/catch para que no se confunda con un fallo de red.
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();

  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    });
  } catch {
    // Aunque el backend no responda, la sesion local debe cerrarse igual.
  }

  cookieStore.delete("ustudent_access");
  cookieStore.delete("ustudent_refresh");
  redirect("/login");
}

/**
 * Copia las cookies `Set-Cookie` del backend a la respuesta de Next.
 *
 * Se respetan los atributos que envio la API (`path`, `maxAge`, `sameSite`) en
 * lugar de fijarlos aqui: quien decide como vive la sesion es el backend, y
 * duplicar esa decision en el cliente garantiza que algun dia dejen de
 * coincidir. `httpOnly` se fuerza porque es la propiedad que no se negocia.
 */
async function forwardAuthCookies(response: Response): Promise<void> {
  const cookieStore = await cookies();

  for (const raw of response.headers.getSetCookie()) {
    const [pair, ...attributes] = raw.split(";");
    const separator = pair.indexOf("=");
    if (separator < 0) {
      continue;
    }

    const name = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();
    const options: Parameters<typeof cookieStore.set>[2] = { httpOnly: true };

    for (const attribute of attributes) {
      const [key, attrValue] = attribute.split("=").map((part) => part.trim());
      switch (key.toLowerCase()) {
        case "path":
          options.path = attrValue;
          break;
        case "max-age":
          options.maxAge = Number(attrValue);
          break;
        case "samesite":
          options.sameSite = attrValue.toLowerCase() as "lax" | "strict" | "none";
          break;
        case "secure":
          options.secure = true;
          break;
      }
    }

    cookieStore.set(name, value, options);
  }
}
