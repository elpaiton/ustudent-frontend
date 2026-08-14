import Link from "next/link";
import type { CurrentUser } from "@/types/auth";
import { hasAnyPermission } from "@/lib/auth/session";

interface NavItem {
  label: string;
  href: string;
  /** Se muestra si el usuario tiene al menos uno de estos permisos. */
  permissions: string[];
}

const NAV: NavItem[] = [
  { label: "Panel", href: "/dashboard", permissions: [] },
  { label: "Mis solicitudes", href: "/estudiante/solicitudes", permissions: ["case:create:self"] },
  { label: "Bienestar", href: "/estudiante/bienestar", permissions: ["mood:create:self"] },
  { label: "Reportar estudiante", href: "/docente/reportes", permissions: ["case:create:staff"] },
  { label: "Mis estudiantes", href: "/docente/estudiantes", permissions: ["student:read:group"] },
  { label: "Bandeja de casos", href: "/admin/solicitudes", permissions: ["case:read:assigned", "case:read:any"] },
  { label: "Riesgo", href: "/admin/riesgo", permissions: ["risk:read:dashboard"] },
  { label: "Usuarios", href: "/admin/usuarios", permissions: ["user:read"] },
  { label: "Roles", href: "/admin/roles", permissions: ["role:read"] },
  { label: "Parametros", href: "/admin/parametros", permissions: ["risk:model:manage"] },
];

/**
 * Menu lateral construido a partir de los permisos del usuario.
 *
 * Ocultar no es autorizar: esto solo evita mostrar puertas que no se pueden
 * abrir. Quien escriba la URL a mano recibira un 403 del servidor, que es
 * donde vive la autorizacion de verdad.
 */
export function Sidebar({ user }: { user: CurrentUser }) {
  const visible = NAV.filter(
    (item) => item.permissions.length === 0 || hasAnyPermission(user, item.permissions),
  );

  return (
    <aside className="flex w-full flex-row gap-1 overflow-x-auto bg-blue-900 p-3 md:h-screen md:w-60 md:flex-col md:gap-0.5 md:p-4">
      <div className="hidden md:mb-6 md:block">
        <p className="text-lg font-semibold text-white">uStudent</p>
        <p className="text-xs text-blue-200">Permanencia estudiantil</p>
      </div>

      <nav aria-label="Navegacion principal" className="flex flex-row gap-1 md:flex-col">
        {visible.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[var(--radius-control)] px-3 py-2 text-sm whitespace-nowrap text-blue-100 transition-colors hover:bg-blue-700 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
