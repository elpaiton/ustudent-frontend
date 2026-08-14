/**
 * Tipos del contrato de autenticacion.
 *
 * Provisionales: en cuanto el backend publique el OpenAPI de estos endpoints,
 * `src/types/api.ts` se genera con `npm run generate:api` y estos se sustituyen
 * por los generados. Escribir tipos a mano contra una API ajena es exactamente
 * la forma de que el cliente y el servidor dejen de coincidir en silencio.
 */

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/** Error RFC 7807 tal como lo emite el backend. */
export interface ProblemDetail {
  title?: string;
  status?: number;
  detail?: string;
  code?: string;
  traceId?: string;
  errors?: Array<{ field: string; message: string }>;
}
