/**
 * Cliente HTTP contra la API de uStudent.
 *
 * Dos decisiones que conviene no deshacer:
 *
 * 1. `credentials: "include"` en toda peticion. La sesion viaja en una cookie
 *    httpOnly (ADR-0005), no en localStorage: el token queda fuera del alcance
 *    de JavaScript y los Server Components pueden leerlo.
 * 2. Los errores del servidor llegan en formato RFC 7807. Se traducen a
 *    `ApiError`, que conserva el `code` estable y el `traceId` con el que el
 *    equipo puede localizar la peticion en los logs.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

/** Cuerpo de error RFC 7807 tal como lo emite GlobalExceptionHandler. */
export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string;
  traceId?: string;
  errors?: Array<{ field: string; message: string }>;
}

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
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Evita radicados duplicados ante un doble clic o un reintento de red. */
  idempotencyKey?: string;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, idempotencyKey, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    // Un error puede no traer cuerpo JSON (502 de un proxy, por ejemplo).
    const problem: ProblemDetail = await response.json().catch(() => ({
      title: "No pudimos contactar el servidor",
      status: response.status,
    }));
    throw new ApiError(response.status, problem);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: RequestOptions) => apiFetch<T>(path, { ...options, method: "DELETE" }),
};
