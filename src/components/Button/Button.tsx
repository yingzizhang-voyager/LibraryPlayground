import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

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
 * Button — 1:1 with Figma component set `1241:14078`.
 *
 * Props:
 *   variant   default | outline | filled | ghost | link | destructive | success
 *   size      sm (24px) | md (32px) | lg (36px)
 *   leftIcon  leading icon slot
 *   rightIcon trailing icon slot
 *   loading   spinner + disabled semantics
 *
 * Interaction states (hover / active / focus / disabled) are pure CSS.
 * Pass native `type="submit"` etc. via the standard HTML attribute.
 * Icon-only (square) buttons: add `className="px-0 aspect-square"`.
 * ──────────────────────────────────────────────────────────── */

export type ButtonVariant =
  | "default"
  | "outline"
  | "filled"
  | "ghost"
  | "link"
  | "destructive"
  | "success";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

const SIZE: Record<ButtonSize, string> = {
  sm: "h-6 px-2 gap-1 text-caption rounded-sm",
  md: "h-8 px-3 gap-1.5 text-body rounded-md",
  lg: "h-9 px-3.5 gap-2 text-body rounded-md",
};

const ICON_SIZE: Record<ButtonSize, number> = { sm: 14, md: 16, lg: 16 };

function variantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "default":
      return cx(
        "bg-button-primary text-button-primary-foreground border border-button-primary",
        "hover:bg-basalt-700 hover:border-basalt-700",
        "active:bg-basalt-800 active:border-basalt-800",
        "disabled:bg-fill-primary disabled:border-fill-primary disabled:text-white",
      );
    case "outline":
      return cx(
        "bg-white text-foreground border border-border-secondary",
        "hover:bg-hover hover:border-border-primary",
        "active:bg-press",
        "disabled:bg-white disabled:text-label-tertiary disabled:border-border-tertiary",
      );
    case "filled":
      return cx(
        "bg-muted text-foreground border border-transparent",
        "hover:bg-secondary",
        "active:bg-accent",
        "disabled:text-label-tertiary",
      );
    case "ghost":
      return cx(
        "bg-transparent text-foreground border border-transparent",
        "hover:bg-hover",
        "active:bg-press",
        "disabled:text-label-tertiary disabled:hover:bg-transparent",
      );
    case "link":
      return cx(
        "bg-transparent text-foreground border border-transparent px-0",
        "hover:underline",
        "disabled:text-label-tertiary disabled:hover:no-underline",
      );
    case "destructive":
      return cx(
        "bg-error text-white border border-error",
        "hover:bg-shell-700 hover:border-shell-700",
        "active:bg-shell-800 active:border-shell-800",
        "disabled:bg-shell-300 disabled:border-shell-300",
      );
    case "success":
      return cx(
        "bg-success text-white border border-success",
        "hover:bg-jade-800 hover:border-jade-800",
        "active:bg-jade-900 active:border-jade-900",
        "disabled:bg-jade-300 disabled:border-jade-300",
      );
  }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "default",
      size = "md",
      leftIcon,
      rightIcon,
      loading = false,
      disabled,
      type = "button",
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-variant={variant}
        data-size={size}
        data-loading={loading || undefined}
        className={cx(
          "relative inline-flex shrink-0 items-center justify-center font-sans font-regular",
          "transition-colors duration-150 select-none",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-glacier",
          "disabled:cursor-not-allowed",
          SIZE[size],
          variantClasses(variant),
          className,
        )}
        {...rest}
      >
        {loading ? (
          <Loader2
            size={ICON_SIZE[size]}
            strokeWidth={1.6}
            className="animate-spin"
            aria-hidden="true"
          />
        ) : (
          <>
            {leftIcon && (
              <span aria-hidden="true" className="inline-flex shrink-0">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span aria-hidden="true" className="inline-flex shrink-0">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  },
);
