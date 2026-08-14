/**
 * Mensaje de error de pantalla completa.
 *
 * Muestra el traceId cuando existe: es lo que permite que un usuario reporte
 * un problema y el equipo encuentre exactamente su peticion en los logs, sin
 * exponerle nada tecnico.
 */
export function ErrorPanel({
  title,
  detail,
  traceId,
}: {
  title: string;
  detail: string;
  traceId?: string;
}) {
  return (
    <div
      role="alert"
      className="rounded-[var(--radius-card)] border border-[#F3C9C4] bg-[#FBE9E7] px-5 py-4"
    >
      <p className="font-medium text-[#98271E]">{title}</p>
      <p className="mt-1 text-sm text-[#98271E]">{detail}</p>
      {traceId && (
        <p className="mt-2 font-mono text-xs text-[#98271E] opacity-80">
          Codigo de seguimiento: {traceId}
        </p>
      )}
    </div>
  );
}
