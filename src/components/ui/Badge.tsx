import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const TONES: Record<Tone, string> = {
  neutral: "bg-neutral-50 text-neutral-700 border-neutral-200",
  success: "bg-teal-50 text-teal-700 border-teal-300",
  warning: "bg-[#FDF3E2] text-[#8A5300] border-[#F0D9AE]",
  danger: "bg-[#FBE9E7] text-[#98271E] border-[#F3C9C4]",
  info: "bg-blue-50 text-blue-700 border-blue-100",
};

/**
 * Etiqueta de estado.
 *
 * Siempre lleva texto: el color acompana, nunca sustituye. Un usuario que no
 * distingue rojo de verde tiene que poder leer lo mismo (RNF-U1).
 */
export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
