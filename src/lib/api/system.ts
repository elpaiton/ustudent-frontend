import { api } from "./client";

export interface PingResponse {
  application: string;
  status: string;
  timestamp: string;
}

/**
 * Comprueba que la API responde. Es el recorrido que cierra la fase 0:
 * navegador → Next.js → Spring Boot.
 */
export function ping(): Promise<PingResponse> {
  return api.get<PingResponse>("/system/ping", { cache: "no-store" });
}
