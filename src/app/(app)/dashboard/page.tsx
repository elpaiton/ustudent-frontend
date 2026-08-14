import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Panel · uStudent",
};

export default async function DashboardPage() {
  // El layout ya garantiza que hay sesion; aqui solo se lee (viene de cache).
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <header>
        <h1 className="text-2xl font-semibold text-neutral-900">
          Hola, {user.fullName.split(" ")[0]}
        </h1>
        <p className="mt-1 text-neutral-500">
          Esta es la fase 1: la sesion funciona y el menu se arma con tus permisos reales.
        </p>
      </header>

      <section className="rounded-[var(--radius-card)] border border-neutral-200 bg-white p-5 shadow-[var(--shadow-sm)]">
        <h2 className="text-base font-semibold text-neutral-900">Tu rol</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {user.roles.map((role) => (
            <li
              key={role}
              className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
            >
              {role}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[var(--radius-card)] border border-neutral-200 bg-white p-5 shadow-[var(--shadow-sm)]">
        <h2 className="text-base font-semibold text-neutral-900">
          Permisos efectivos{" "}
          <span className="tabular text-neutral-500">({user.permissions.length})</span>
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Vienen del token que emitio el backend. El menu lateral se construye con ellos.
        </p>

        {user.permissions.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">
            Tu cuenta aun no tiene permisos asignados. Comunicate con la administracion.
          </p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2">
            {user.permissions.map((permission) => (
              <li
                key={permission}
                className="rounded-[var(--radius-control)] bg-neutral-50 px-2.5 py-1 font-mono text-xs text-neutral-700"
              >
                {permission}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
