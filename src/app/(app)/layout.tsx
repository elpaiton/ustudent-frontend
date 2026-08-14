import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { logout } from "@/features/auth/actions";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * Layout del area autenticada.
 *
 * La comprobacion de sesion se hace aqui, en el servidor, y no solo en el
 * proxy: el proxy mira si existe la cookie, pero solo el backend sabe si sigue
 * siendo valida.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar user={user} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-900">{user.fullName}</p>
            <p className="truncate text-xs text-neutral-500">{user.email}</p>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Salir
            </button>
          </form>
        </header>

        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
