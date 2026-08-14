import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Entrar · uStudent",
};

export default async function LoginPage() {
  // Quien ya tiene sesion no deberia ver el formulario.
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <header className="mb-8">
          <p className="text-sm font-medium tracking-wide text-teal-700 uppercase">
            Permanencia estudiantil
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-neutral-900">uStudent</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Entra con tu correo institucional para continuar.
          </p>
        </header>

        <div className="rounded-[var(--radius-card)] border border-neutral-200 bg-white p-6 shadow-[var(--shadow-sm)]">
          <LoginForm />
        </div>

        <p className="mt-6 text-sm text-neutral-500">
          Si tienes problemas para entrar, comunicate con bienestar universitario.
        </p>
      </div>
    </main>
  );
}
