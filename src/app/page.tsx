import { StatusCard, type ServiceStatus } from "@/components/ui/StatusCard";
import { ping } from "@/lib/api/system";
import { ApiError } from "@/lib/api/client";

/**
 * Pantalla de verificacion de la fase 0.
 *
 * Es un Server Component: la llamada al backend ocurre en el servidor de
 * Next.js, que es el mismo camino que usaran las vistas protegidas cuando
 * lean la cookie de sesion en la fase 1.
 */
export const dynamic = "force-dynamic";

export default async function Home() {
  let status: ServiceStatus = "error";
  let detail: string | undefined;
  let hint: string | undefined;

  try {
    const response = await ping();
    status = "ok";
    detail = `${response.application} · ${response.status} · ${response.timestamp}`;
  } catch (error) {
    if (error instanceof ApiError) {
      detail = `${error.status} · ${error.code}${error.traceId ? ` · traza ${error.traceId}` : ""}`;
      hint = error.message;
    } else {
      detail = "No hubo respuesta del backend.";
      hint =
        "Levanta PostgreSQL con docker compose y arranca el backend con ./mvnw spring-boot:run " +
        "en apps/ustudent-backend.";
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <header>
        <p className="text-sm font-medium tracking-wide text-teal-700 uppercase">
          Fase 0 · cimientos
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-900">uStudent</h1>
        <p className="mt-3 max-w-xl text-neutral-500">
          Plataforma de promocion y permanencia estudiantil. Esta pantalla existe para
          comprobar que el recorrido completo funciona: navegador, Next.js y la API.
        </p>
      </header>

      <StatusCard title="API de uStudent" status={status} detail={detail} hint={hint} />

      <section className="rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-5 shadow-[var(--shadow-sm)]">
        <h2 className="text-base font-semibold text-neutral-900">Paleta institucional</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Azul para navegacion y acciones; turquesa para datos e indicadores.
        </p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {[
            { name: "blue-900", className: "bg-blue-900" },
            { name: "blue-600", className: "bg-blue-600" },
            { name: "blue-400", className: "bg-blue-400" },
            { name: "teal-700", className: "bg-teal-700" },
            { name: "teal-500", className: "bg-teal-500" },
            { name: "teal-300", className: "bg-teal-300" },
            { name: "neutral-200", className: "bg-neutral-200" },
          ].map((token) => (
            <li key={token.name} className="flex flex-col items-center gap-1">
              <span
                aria-hidden="true"
                className={`block h-12 w-12 rounded-[var(--radius-control)] ${token.className}`}
              />
              <span className="text-xs text-neutral-500">{token.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="text-sm text-neutral-500">
        Siguiente paso:{" "}
        <span className="font-medium text-neutral-700">fase 1 · identidad y acceso</span>. Empieza
        por el login y <code className="font-mono">GET /auth/me</code>, antes de cualquier CRUD.
      </footer>
    </main>
  );
}
