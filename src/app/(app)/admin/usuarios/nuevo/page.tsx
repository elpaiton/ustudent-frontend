import type { Metadata } from "next";
import Link from "next/link";
import { ErrorPanel } from "@/components/ui/ErrorPanel";
import { NewUserForm } from "@/features/users/NewUserForm";
import { listRoles } from "@/features/users/api";
import { ApiError } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Crear usuario · uStudent",
};

export default async function NuevoUsuarioPage() {
  let roles;
  try {
    roles = await listRoles();
  } catch (error) {
    return (
      <ErrorPanel
        title="No pudimos cargar los roles"
        detail={
          error instanceof ApiError && error.isForbidden
            ? "Crear usuarios requiere los permisos user:manage y role:read."
            : "El servidor no respondio. Intenta de nuevo en un momento."
        }
        traceId={error instanceof ApiError ? error.traceId : undefined}
      />
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <nav aria-label="Miga de pan" className="mb-4 text-sm text-neutral-500">
        <Link href="/admin/usuarios" className="hover:text-neutral-700">
          Usuarios
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-neutral-700">Crear</span>
      </nav>

      <h1 className="text-2xl font-semibold text-neutral-900">Crear usuario</h1>
      <p className="mt-1 mb-6 text-sm text-neutral-500">
        La cuenta queda activa de inmediato y la persona podra entrar con la contrasena que le
        asignes aqui.
      </p>

      <div className="rounded-[var(--radius-card)] border border-neutral-200 bg-white p-6 shadow-[var(--shadow-sm)]">
        <NewUserForm roles={roles} />
      </div>
    </div>
  );
}
