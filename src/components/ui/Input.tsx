import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  hint?: string;
}

/**
 * Campo de formulario.
 *
 * La etiqueta es un `<label>` real asociado al campo: los `placeholder` no
 * sustituyen etiquetas, porque desaparecen al escribir y los lectores de
 * pantalla no siempre los anuncian (RNF-U1).
 */
export function Input({ label, name, error, hint, className = "", ...props }: InputProps) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={[
          "rounded-[var(--radius-control)] border bg-white px-3 py-2.5 text-sm",
          "text-neutral-900 placeholder:text-neutral-500",
          error ? "border-[var(--color-danger)]" : "border-neutral-200",
          className,
        ].join(" ")}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={hintId} className="text-sm text-neutral-500">
          {hint}
        </p>
      )}
    </div>
  );
}
