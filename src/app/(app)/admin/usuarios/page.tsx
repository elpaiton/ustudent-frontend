import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorPanel } from "@/components/ui/ErrorPanel";
import { listUsers, type AdminUser } from "@/features/users/api";
import { toggleUserStatus } from "@/features/users/actions";
import { ApiError } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Usuarios · uStudent",
};

/**
 * Estado de la cuenta y accion disponible, resueltos juntos.
 *
 * Van en la misma funcion a proposito. Cuando se calculaban por separado, una
 * cuenta con bloqueo ya vencido se mostraba como "Activa" y a la vez ofrecia
 * "Activar", porque el badge miraba `locked` y el boton miraba `status`.
 *
 * Una cuenta LOCKED con el bloqueo vencido puede entrar: para el usuario es
 * una cuenta activa, aunque en la base el estado siga marcado.
 */
function describeAccount(user: AdminUser) {
  if (user.locked) {
    return {
      tone: "warning" as const,
      label: "Bloqueada temporalmente",
      action: "Desbloquear",
      nextStatus: "ACTIVE" as const,
    };
  }
  if (user.status === "INACTIVE") {
    return {
      tone: "danger" as const,
      label: "Inactiva",
      action: "Activar",
      nextStatus: "ACTIVE" as const,
    };
  }
  return {
    tone: "success" as const,
    label: "Activa",
    action: "Desactivar",
    nextStatus: "INACTIVE" as const,
  };
}

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;

  let page;
  try {
    page = await listUsers(query);
  } catch (error) {
    if (error instanceof ApiError && error.isForbidden) {
      return (
        <ErrorPanel
          title="No tienes acceso a esta seccion"
          detail="Gestionar usuarios requiere el permiso user:read. Pidelo a un administrador."
          traceId={error.traceId}
        />
      );
    }
    return (
      <ErrorPanel
        title="No pudimos cargar los usuarios"
        detail={error instanceof ApiError ? error.message : "El servidor no respondio."}
        traceId={error instanceof ApiError ? error.traceId : undefined}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Usuarios</h1>
          <p className="mt-1 text-sm text-neutral-500">
            <span className="tabular">{page.totalElements}</span>{" "}
            {page.totalElements === 1 ? "cuenta registrada" : "cuentas registradas"}
          </p>
        </div>

        <Link href="/admin/usuarios/nuevo">
          <Button>Crear usuario</Button>
        </Link>
      </header>

      <form className="flex gap-2" action="/admin/usuarios">
        <label htmlFor="query" className="sr-only">
          Buscar por nombre, correo o documento
        </label>
        <input
          id="query"
          name="query"
          defaultValue={query ?? ""}
          placeholder="Buscar por nombre, correo o documento"
          className="w-full max-w-sm rounded-[var(--radius-control)] border border-neutral-200 bg-white px-3 py-2 text-sm"
        />
        <Button type="submit" variant="secondary">
          Buscar
        </Button>
      </form>

      {page.content.length === 0 ? (
        <EmptyState
          title={query ? "Ningun usuario coincide con la busqueda" : "Todavia no hay usuarios"}
          description={
            query
              ? "Revisa el texto o busca por documento completo."
              : "Crea la primera cuenta para empezar a trabajar."
          }
          action={
            <Link href="/admin/usuarios/nuevo">
              <Button>Crear usuario</Button>
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-card)] border border-neutral-200 bg-white shadow-[var(--shadow-sm)]">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs tracking-wide text-neutral-500 uppercase">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Nombre</th>
                <th scope="col" className="px-4 py-3 font-medium">Correo</th>
                <th scope="col" className="px-4 py-3 font-medium">Roles</th>
                <th scope="col" className="px-4 py-3 font-medium">Estado</th>
                <th scope="col" className="px-4 py-3 font-medium">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {page.content.map((user) => {
                const account = describeAccount(user);
                return (
                <tr key={user.id} className="border-b border-neutral-200 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900">{user.fullName}</p>
                    <p className="tabular text-xs text-neutral-500">{user.documentNumber}</p>
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge key={role} tone="info">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={account.tone}>{account.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={toggleUserStatus}>
                      <input type="hidden" name="userId" value={user.id} />
                      <input type="hidden" name="status" value={account.nextStatus} />
                      <Button type="submit" variant="ghost">
                        {account.action}
                      </Button>
                    </form>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {page.totalPages > 1 && (
        <p className="text-sm text-neutral-500">
          Pagina <span className="tabular">{page.page + 1}</span> de{" "}
          <span className="tabular">{page.totalPages}</span>
        </p>
      )}
    </div>
  );
}
