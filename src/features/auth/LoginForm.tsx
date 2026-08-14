"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { login, type LoginState } from "./actions";

const INITIAL: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" fullWidth disabled={pending}>
      {pending ? "Entrando…" : "Entrar"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(login, INITIAL);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.error && (
        // role="alert" hace que el lector de pantalla lo anuncie al aparecer,
        // sin que el usuario tenga que ir a buscarlo.
        <div
          role="alert"
          className="rounded-[var(--radius-control)] border border-[var(--color-danger)] bg-[#FBE9E7] px-4 py-3 text-sm text-[var(--color-danger)]"
        >
          {state.error}
        </div>
      )}

      <Input
        label="Correo institucional"
        name="email"
        type="email"
        autoComplete="username"
        required
        placeholder="nombre@usta.edu.co"
        error={state.fieldErrors?.email}
      />

      <Input
        label="Contrasena"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password}
      />

      <SubmitButton />
    </form>
  );
}
