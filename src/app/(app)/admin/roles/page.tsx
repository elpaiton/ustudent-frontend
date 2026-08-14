import type { Metadata } from "next";
import { ErrorPanel } from "@/components/ui/ErrorPanel";
import { RolePermissionMatrix } from "@/features/users/RolePermissionMatrix";
import { groupByResource, listPermissions, listRoles } from "@/features/users/api";
import { ApiError } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Roles y permisos · uStudent",
};

export default async function RolesPage() {
  let roles;
  let permissions;

  try {
    [roles, permissions] = await Promise.all([listRoles(), listPermissions()]);
  } catch (error) {
    if (error instanceof ApiError && error.isForbidden) {
      return (
        <ErrorPanel
          title="No tienes acceso a esta seccion"
          detail="Ver roles y permisos requiere el permiso role:read."
          traceId={error.traceId}
        />
      );
    }
    return (
      <ErrorPanel
        title="No pudimos cargar los roles"
        detail={error instanceof ApiError ? error.message : "El servidor no respondio."}
        traceId={error instanceof ApiError ? error.traceId : undefined}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-neutral-900">Roles y permisos</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">
          Los endpoints exigen permisos, no roles. Por eso puedes cambiar lo que hace un rol
          desde aqui, sin que nadie despliegue codigo. Los roles predefinidos admiten cambios
          en sus permisos, pero no se pueden eliminar.
        </p>
      </header>

      <RolePermissionMatrix
        roles={roles}
        permissionsByResource={Array.from(groupByResource(permissions))}
      />
    </div>
  );
}
