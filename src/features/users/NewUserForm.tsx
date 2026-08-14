"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createUser, type FormState } from "./actions";
import type { Role } from "./api";

const INITIAL: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creando…" : "Crear usuario"}
    </Button>
  );
}

export function NewUserForm({ roles }: { roles: Role[] }) {
  const [state, formAction] = useActionState(createUser, INITIAL);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.error && (
        <div
          role="alert"
          className="rounded-[var(--radius-control)] border border-[#F3C9C4] bg-[#FBE9E7] px-4 py-3 text-sm text-[#98271E]"
        >
          {state.error}
        </div>
      )}

      <Input
        label="Nombre completo"
        name="fullName"
        required
        autoComplete="name"
        error={state.fieldErrors?.fullName}
      />

      <Input
        label="Correo institucional"
        name="email"
        type="email"
        required
        placeholder="nombre@usta.edu.co"
        error={state.fieldErrors?.email}
      />

      <Input
        label="Numero de documento"
        name="documentNumber"
        inputMode="numeric"
        required
        error={state.fieldErrors?.documentNumber}
      />

      <Input
        label="Contrasena temporal"
        name="password"
        type="password"
        required
        autoComplete="new-password"
        hint="Minimo 10 caracteres. La persona deberia cambiarla al entrar."
        error={state.fieldErrors?.password}
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium text-neutral-700">Roles</legend>
        <p className="mb-2 text-sm text-neutral-500">
          Los permisos del usuario seran la union de los de sus roles.
        </p>

        <div className="flex flex-col gap-2">
          {roles.map((role) => (
            <label
              key={role.id}
              className="flex items-start gap-3 rounded-[var(--radius-control)] border border-neutral-200 px-3 py-2.5"
            >
              <input
                type="checkbox"
                name="roles"
                value={role.code}
                className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
              />
              <span>
                <span className="block text-sm font-medium text-neutral-900">{role.name}</span>
                <span className="block text-xs text-neutral-500">
                  {role.permissions.length}{" "}
                  {role.permissions.length === 1 ? "permiso" : "permisos"}
                  {role.description ? ` · ${role.description}` : ""}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <SubmitButton />
        <Link href="/admin/usuarios">
          <Button type="button" variant="ghost">
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
}
