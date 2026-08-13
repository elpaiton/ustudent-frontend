/**
 * Tarjeta de estado de un servicio.
 *
 * El estado nunca se comunica solo por color: lleva siempre etiqueta de texto
 * (RNF-U1). Un usuario con daltonismo debe poder leer el mismo dato.
 */
export type ServiceStatus = "ok" | "error" | "loading";

const STATUS_STYLES: Record<ServiceStatus, { dot: string; label: string; text: string }> = {
  ok: { dot: "bg-teal-500", label: "En linea", text: "text-teal-700" },
  error: { dot: "bg-[var(--color-danger)]", label: "Sin conexion", text: "text-[var(--color-danger)]" },
  loading: { dot: "bg-neutral-500 animate-pulse", label: "Comprobando", text: "text-neutral-500" },
};

interface StatusCardProps {
  title: string;
  status: ServiceStatus;
  detail?: string;
  hint?: string;
}

export function StatusCard({ title, status, detail, hint }: StatusCardProps) {
  const style = STATUS_STYLES[status];

  return (
    <div className="rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        <span className={`flex items-center gap-2 text-sm font-medium ${style.text}`}>
          <span aria-hidden="true" className={`inline-block h-2 w-2 rounded-full ${style.dot}`} />
          {style.label}
        </span>
      </div>

      {detail && <p className="mt-3 font-mono text-sm break-all text-neutral-700 tabular">{detail}</p>}
      {hint && <p className="mt-2 text-sm text-neutral-500">{hint}</p>}
    </div>
  );
}
