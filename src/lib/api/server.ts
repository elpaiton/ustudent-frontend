import { cookies } from "next/headers";
import type { ProblemDetail } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

/**
 * Error de la API con la forma RFC 7807 que emite el backend.
 *
 * Conserva `status` y `code` para poder distinguir un 403 de un 404 sin
 * comparar textos, que cambian.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly traceId?: string;
  readonly fieldErrors: Array<{ field: string; message: string }>;

  constructor(status: number, problem: ProblemDetail) {
    super(problem.detail ?? problem.title ?? "Error inesperado");
    this.name = "ApiError";
    this.status = status;
    this.code = problem.code ?? "UNKNOWN";
    this.traceId = problem.traceId;
    this.fieldErrors = problem.errors ?? [];
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }
}

/**
 * Llama a la API desde el servidor reenviando la cookie de sesion.
 *
 * La cookie es `httpOnly`: el navegador no puede leerla ni adjuntarla en una
 * peticion hecha desde el cliente hacia otro origen. Por eso las lecturas del
 * area privada pasan por aqui, en el servidor de Next.js, que si tiene acceso
 * a ella.
 */
export async function serverFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      cookie: cookieStore.toString(),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    const problem: ProblemDetail = await response.json().catch(() => ({
      title: "No pudimos contactar el servidor",
      status: response.status,
    }));
    throw new ApiError(response.status, problem);
  }

  return (await response.json()) as T;
}

/** Respuesta paginada, con la misma forma que publica el backend. */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
