import { forwardRef, useCallback, useState, type ButtonHTMLAttributes } from "react";

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
 * ToggleSwitch — 1:1 with Figma component set `1212:14940`.
 *
 * Single-element component (no compound parts). Provide a `<label>` next
 * to it via your form layout. `htmlFor`/`aria-label` are caller's job.
 *
 * Axes:
 *   • size           sm (h-4 w-7) | md (h-5 w-8)
 *   • checked        boolean (controlled via `checked` / `onCheckedChange`)
 *   • disabled       boolean
 * ──────────────────────────────────────────────────────────── */

export type ToggleSize = "sm" | "md";

export interface ToggleSwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "type"> {
  size?: ToggleSize;
  /** Controlled state. Pair with `onCheckedChange`. */
  checked?: boolean;
  /** Initial state for uncontrolled usage. */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const TRACK: Record<ToggleSize, string> = {
  sm: "h-4 w-7",  // 16 × 28
  md: "h-5 w-9",  // 20 × 36
};
const THUMB: Record<ToggleSize, string> = {
  sm: "h-3 w-3 top-0.5",   // 12 × 12, 2px offset
  md: "h-4 w-4 top-0.5",   // 16 × 16, 2px offset
};
const THUMB_TRANSLATE: Record<ToggleSize, { off: string; on: string }> = {
  sm: { off: "left-0.5",  on: "left-3.5" },   // 2px → 14px
  md: { off: "left-0.5",  on: "left-[18px]" }, // 2px → 18px
};

export const ToggleSwitch = forwardRef<HTMLButtonElement, ToggleSwitchProps>(
  function ToggleSwitch(
    {
      size = "md",
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
    const [internal, setInternal] = useState(defaultChecked ?? false);
    const value = isControlled ? !!checked : internal;

    const toggle = useCallback(() => {
      if (disabled) return;
      const next = !value;
      if (!isControlled) setInternal(next);
      onCheckedChange?.(next);
    }, [disabled, value, isControlled, onCheckedChange]);

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={toggle}
        data-state={value ? "on" : "off"}
        data-size={size}
        className={cx(
          "relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-150",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-glacier",
          TRACK[size],
          value
            ? "bg-brand-action disabled:bg-brand-action-disabled"
            : "bg-basalt-200 disabled:bg-fill-secondary",
          "disabled:cursor-not-allowed",
          className,
        )}
        {...rest}
      >
        <span
          aria-hidden="true"
          className={cx(
            "absolute rounded-full bg-white shadow-sm transition-all duration-150",
            THUMB[size],
            value ? THUMB_TRANSLATE[size].on : THUMB_TRANSLATE[size].off,
          )}
        />
      </button>
    );
  },
);
