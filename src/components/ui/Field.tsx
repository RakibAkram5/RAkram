import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/format";

interface BaseProps {
  label: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
}

function Shell({ id, label, error, hint, required, className, children }: BaseProps & { id: string; required?: boolean; children: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-semibold tracking-wide text-silver">
        {label}
        {required && <span className="text-faint"> *</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({ label, error, hint, className, ...props }: BaseProps & ComponentProps<"input">) {
  const auto = useId();
  const id = props.id ?? auto;
  return (
    <Shell id={id} label={label} error={error} hint={hint} required={props.required} className={className}>
      <input
        id={id}
        className="field"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        {...props}
      />
    </Shell>
  );
}

export function TextArea({ label, error, hint, className, ...props }: BaseProps & ComponentProps<"textarea">) {
  const auto = useId();
  const id = props.id ?? auto;
  return (
    <Shell id={id} label={label} error={error} hint={hint} required={props.required} className={className}>
      <textarea
        id={id}
        className="field min-h-24 resize-y"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        {...props}
      />
    </Shell>
  );
}

export function SelectField({
  label,
  error,
  hint,
  className,
  options,
  placeholder,
  ...props
}: BaseProps & ComponentProps<"select"> & { options: { value: string; label: string }[]; placeholder?: string }) {
  const auto = useId();
  const id = props.id ?? auto;
  return (
    <Shell id={id} label={label} error={error} hint={hint} required={props.required} className={className}>
      <select
        id={id}
        className="field"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Shell>
  );
}
