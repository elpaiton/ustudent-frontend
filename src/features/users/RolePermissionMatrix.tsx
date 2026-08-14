"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { updateRolePermissions, type FormState } from "./actions";
import type { Permission, Role } from "./api";

const INITIAL: FormState = {};

const RESOURCE_LABELS: Record<string, string> = {
  case: "Casos",
  student: "Estudiantes",
  mood: "Bienestar",
  risk: "Riesgo de desercion",
  report: "Reportes",
  user: "Usuarios",
  role: "Roles",
  audit: "Auditoria",
  ai: "Clasificacion automatica",
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando…" : "Guardar permisos"}
    </Button>
  );
}

export function RolePermissionMatrix({
  roles,
  permissionsByResource,
}: {
  roles: Role[];
  permissionsByResource: Array<[string, Permission[]]>;
}) {
  const [selectedId, setSelectedId] = useState(roles[0]?.id ?? "");
  const [state, formAction] = useActionState(updateRolePermissions, INITIAL);

  const selected = roles.find((role) => role.id === selectedId);

  if (!selected) {
    return <p className="text-sm text-neutral-500">No hay roles configurados.</p>;
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <nav aria-label="Roles" className="flex shrink-0 flex-row gap-2 overflow-x-auto lg:w-56 lg:flex-col">
        {roles.map((role) => {
          const active = role.id === selectedId;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelectedId(role.id)}
              aria-current={active ? "true" : undefined}
              className={[
                "rounded-[var(--radius-control)] border px-3 py-2.5 text-left whitespace-nowrap transition-colors",
                active
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
              ].join(" ")}
            >
              <span className="block text-sm font-medium">{role.name}</span>
              <span className="block text-xs opacity-80">
                {role.permissions.length} permisos
              </span>
            </button>
          );
        })}
      </nav>

      {/* key fuerza a React a rehacer el formulario al cambiar de rol: sin
          esto, las casillas conservarian el estado del rol anterior. */}
      <form key={selected.id} action={formAction} className="min-w-0 flex-1">
        <input type="hidden" name="roleId" value={selected.id} />

        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900">
              {selected.name}
              {selected.system && <Badge tone="neutral">Predefinido</Badge>}
            </h2>
            <p className="mt-0.5 font-mono text-xs text-neutral-500">{selected.code}</p>
          </div>
          <SaveButton />
        </header>

        {state.error && (
          <div
            role="alert"
            className="mb-4 rounded-[var(--radius-control)] border border-[#F3C9C4] bg-[#FBE9E7] px-4 py-3 text-sm text-[#98271E]"
          >
            {state.error}
          </div>
        )}

        {state.success && (
          <div
            role="status"
            className="mb-4 rounded-[var(--radius-control)] border border-teal-300 bg-teal-50 px-4 py-3 text-sm text-teal-700"
          >
            {state.success}
          </div>
        )}

        <p className="mb-4 text-sm text-neutral-500">
          Quien tenga la sesion abierta conservara sus permisos hasta que expire su token de
          acceso, como maximo 30 minutos.
        </p>

        <div className="flex flex-col gap-4">
          {permissionsByResource.map(([resource, permissions]) => (
            <fieldset
              key={resource}
              className="rounded-[var(--radius-card)] border border-neutral-200 bg-white p-4"
            >
              <legend className="px-1 text-sm font-semibold text-neutral-900">
                {RESOURCE_LABELS[resource] ?? resource}
              </legend>

              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {permissions.map((permission) => (
                  <label key={permission.code} className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      name="permissions"
                      value={permission.code}
                      defaultChecked={selected.permissions.includes(permission.code)}
                      className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
                    />
                    <span className="min-w-0">
                      <span className="block font-mono text-xs text-neutral-700">
                        {permission.code}
                      </span>
                      {permission.description && (
                        <span className="block text-xs text-neutral-500">
                          {permission.description}
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </form>
    </div>
  );
}
