import type { ReactNode } from "react";

/**
 * Estado vacio.
 *
 * Nunca dice "Sin datos": explica por que no hay nada y que puede hacer el
 * usuario al respecto. Un listado vacio sin explicacion se confunde con una
 * pantalla rota.
 */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-dashed border-neutral-200 bg-white px-6 py-12 text-center">
      <p className="font-medium text-neutral-900">{title}</p>
      <p className="max-w-sm text-sm text-neutral-500">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
