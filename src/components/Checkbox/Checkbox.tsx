import { forwardRef, useCallback, useState, type ButtonHTMLAttributes } from "react";
import { Check, Minus } from "lucide-react";

type ClassPart = string | false | null | undefined | ClassPart[];
function cx(...parts: ClassPart[]): string {
  const out: string[] = [];
  for (const p of parts) {
    if (!p) continue;
    if (Array.isArray(p)) out.push(cx(...p));
    else out.push(p);
  }
  return out.join(" ");
}

/* ────────────────────────────────────────────────────────────────
 * Checkbox — 16×16.
 *
 * Axes:
 *   • checked         boolean | "indeterminate"
 *   • disabled        boolean
 * ──────────────────────────────────────────────────────────── */

export interface CheckboxProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "type" | "defaultChecked"> {
  /** Controlled. Pass `"indeterminate"` for the mixed state. */
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean | "indeterminate";
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  function Checkbox(
    {
      checked,
      defaultChecked,
      onCheckedChange,
      disabled,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const isControlled = checked !== undefined;
    const [internal, setInternal] = useState<boolean | "indeterminate">(
      defaultChecked ?? false,
    );
    const value = isControlled ? checked ?? false : internal;
    const isOn = value === true;
    const isIndeterminate = value === "indeterminate";

    const toggle = useCallback(() => {
      if (disabled) return;
      const next = !isOn;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next);
    }, [disabled, isOn, isControlled, onCheckedChange]);

    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={isIndeterminate ? "mixed" : isOn}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={toggle}
        data-state={isOn ? "checked" : isIndeterminate ? "indeterminate" : "unchecked"}
        className={cx(
          "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors duration-150",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-glacier",
          (isOn || isIndeterminate)
            ? "bg-brand-action border-brand-action text-white disabled:bg-brand-action-disabled disabled:border-brand-action-disabled"
            : "bg-white border-border-secondary hover:border-border-primary disabled:bg-muted disabled:border-border-tertiary",
          "disabled:cursor-not-allowed",
          className,
        )}
        {...rest}
      >
        {isIndeterminate ? (
          <Minus size={12} strokeWidth={3} aria-hidden="true" />
        ) : isOn ? (
          <Check size={12} strokeWidth={3} aria-hidden="true" />
        ) : null}
      </button>
    );
  },
);
