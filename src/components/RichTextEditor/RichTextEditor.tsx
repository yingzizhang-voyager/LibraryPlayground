import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Icons, type ToolbarIconName } from "./icons";

/* ────────────────────────────────────────────────────────────────
 * Internal helpers
 * ──────────────────────────────────────────────────────────── */

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ────────────────────────────────────────────────────────────────
 * Context — shared state for the compound parts
 * ──────────────────────────────────────────────────────────── */

interface RteContextValue {
  value: string;
  setValue: (next: string) => void;
  disabled: boolean;
  error: boolean;
  inputId: string;
}

const RteContext = createContext<RteContextValue | null>(null);

function useRte(component: string): RteContextValue {
  const ctx = useContext(RteContext);
  if (!ctx) {
    throw new Error(
      `<RichTextEditor.${component}> must be rendered inside <RichTextEditor.Root>`,
    );
  }
  return ctx;
}

/* ────────────────────────────────────────────────────────────────
 * Root — provides state context, lays out Label / Field / HintText
 * ──────────────────────────────────────────────────────────── */

interface RootProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Controlled HTML value. Pair with `onValueChange`. */
  value?: string;
  /** Initial HTML value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the new HTML value whenever the user edits the input. */
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

function Root({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  error = false,
  className,
  children,
  ...rest
}: RootProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const currentValue = isControlled ? (value ?? "") : internal;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const inputId = useId();

  return (
    <RteContext.Provider
      value={{ value: currentValue, setValue, disabled, error, inputId }}
    >
      <div
        className={cx("flex w-full flex-col gap-1 font-sans", className)}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        {...rest}
      >
        {children}
      </div>
    </RteContext.Provider>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Label — text rendered above the field, wired to Input's id
 * ──────────────────────────────────────────────────────────── */

function Label({ className, children, ...rest }: HTMLAttributes<HTMLLabelElement>) {
  const { inputId } = useRte("Label");
  return (
    <div className="px-1 pt-px mb-1">
      <label
        htmlFor={inputId}
        className={cx("text-body text-foreground", className)}
        {...rest}
      >
        {children}
      </label>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Field — the bordered surface wrapping Toolbar + Input
 *
 * Visual state is derived from CSS pseudo-classes + data-attributes
 * on the Root (which sets `data-error` / `data-disabled`). Focus is
 * tracked with native `:focus-within` so Storybook's pseudo-state
 * addon can force the "Active" variants without prop hacks.
 * ──────────────────────────────────────────────────────────── */

function Field({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { disabled, error } = useRte("Field");
  return (
    <div
      className={cx(
        // base
        "group/field relative overflow-hidden rounded-lg bg-white border",
        "transition-[box-shadow,border-color] duration-150",
        // state branches (mutually exclusive)
        disabled && "border-border-tertiary bg-muted",
        !disabled && error && "border-error",
        !disabled && error && "focus-within:shadow-[0_0_0_3px_var(--color-error-ring)]",
        !disabled && !error && "border-border-secondary",
        !disabled && !error && "hover:border-border-primary",
        !disabled && !error && "focus-within:border-brand-glacier focus-within:shadow-[0_0_0_3px_var(--color-brand-card-background)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Toolbar — flex row above the input
 * ──────────────────────────────────────────────────────────── */

function Toolbar({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="toolbar"
      className={cx("flex items-center gap-1 bg-background group-focus-within/field:bg-muted px-1 py-1", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * ToolbarButton — 24×24 icon button keyed by an `action` name.
 *
 * `action` selects a built-in icon from `Icons`. For a custom icon
 * pass `icon` (overrides `action`) + an `aria-label`.
 * ──────────────────────────────────────────────────────────── */

interface ToolbarButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  action?: ToolbarIconName;
  /** Custom icon node, overrides `action`'s default icon. */
  icon?: ReactNode;
  "aria-label"?: string;
}

function ToolbarButton({
  action,
  icon,
  "aria-label": ariaLabel,
  disabled: disabledProp,
  className,
  ...rest
}: ToolbarButtonProps) {
  const { disabled: ctxDisabled } = useRte("ToolbarButton");
  const disabled = disabledProp ?? ctxDisabled;
  const Icon = action ? Icons[action] : null;

  return (
    <button
      type="button"
      aria-label={ariaLabel ?? (action ? labelFromAction(action) : undefined)}
      disabled={disabled}
      className={cx(
        "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm",
        "text-fill-primary group-focus-within/field:text-label-secondary transition-colors",
        "hover:bg-hover active:bg-press",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
        "focus-visible:outline-brand-glacier",
        className,
      )}
      {...rest}
    >
      {icon ?? (Icon && <Icon size={16} strokeWidth={1.6} aria-hidden="true" />)}
    </button>
  );
}

function labelFromAction(action: ToolbarIconName): string {
  return action
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

/* ────────────────────────────────────────────────────────────────
 * ToolbarSeparator — thin vertical divider between button groups
 * ──────────────────────────────────────────────────────────── */

function ToolbarSeparator({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      className={cx("flex h-6 w-1 shrink-0 items-center justify-center px-0.5", className)}
    >
      <div className="h-5 w-px bg-border-transparent" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Slot — flex spacer for layout (`side="right"` adds `ml-auto`)
 * ──────────────────────────────────────────────────────────── */

interface SlotProps extends HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right";
}

function Slot({ side, className, children, ...rest }: SlotProps) {
  return (
    <div
      className={cx(
        "inline-flex items-center gap-1",
        side === "right" && "ml-auto",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * AddVariableButton — common right-slot pill: "{ } Add variable"
 * ──────────────────────────────────────────────────────────── */

interface AddVariableButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children?: ReactNode;
}

function AddVariableButton({
  children = "Add variable",
  className,
  disabled: disabledProp,
  ...rest
}: AddVariableButtonProps) {
  const { disabled: ctxDisabled } = useRte("AddVariableButton");
  const disabled = disabledProp ?? ctxDisabled;
  return (
    <button
      type="button"
      disabled={disabled}
      className={cx(
        "inline-flex h-5 shrink-0 items-center gap-1 px-2 rounded-sm",
        "text-caption text-label-quaternary transition-colors group-focus-within/field:text-brand-glacier",
        "hover:bg-hover active:bg-press",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]",
        "focus-visible:outline-brand-glacier",
        className,
      )}
      {...rest}
    >
      <Icons.braces size={12} strokeWidth={1.6} aria-hidden="true" />
      <span>{children}</span>
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Input — the contentEditable region + placeholder overlay
 * ──────────────────────────────────────────────────────────── */

interface InputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onInput"> {
  placeholder?: string;
  name?: string;
}

function Input({ placeholder, name, className, ...rest }: InputProps) {
  const { value, setValue, disabled, error, inputId } = useRte("Input");
  const ref = useRef<HTMLDivElement>(null);
  const isEmpty = !value || value === "<br>";

  useEffect(() => {
    const el = ref.current;
    if (el && el.innerHTML !== value) el.innerHTML = value;
  }, [value]);

  const handleInput = useCallback(
    (e: FormEvent<HTMLDivElement>) => {
      setValue((e.target as HTMLDivElement).innerHTML);
    },
    [setValue],
  );

  return (
    <div className="relative min-h-[4.25rem] px-2 py-2">
      {isEmpty && placeholder && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-2 top-2 select-none text-body text-label-tertiary"
        >
          {placeholder}
        </span>
      )}
      <div
        ref={ref}
        id={inputId}
        role="textbox"
        data-name={name}
        aria-multiline="true"
        aria-disabled={disabled || undefined}
        aria-invalid={error || undefined}
        contentEditable={!disabled}
        suppressContentEditableWarning
        onInput={handleInput}
        className={cx(
          "min-h-[3.25rem] outline-none text-body text-foreground",
          disabled && "cursor-not-allowed",
          className,
        )}
        {...rest}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * HintText — message below the field (red when error=true)
 * ──────────────────────────────────────────────────────────── */

function HintText({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  const { error } = useRte("HintText");
  return (
    <p
      role={error ? "alert" : undefined}
      className={cx(
        "flex items-start gap-1 px-1 text-body",
        error ? "text-error" : "text-label-tertiary",
        className,
      )}
      {...rest}
    >
      {error && (
        <Icons.close
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className="mt-0.5 shrink-0"
        />
      )}
      <span>{children}</span>
    </p>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Public namespace export
 * ──────────────────────────────────────────────────────────── */

export const RichTextEditor = {
  Root,
  Label,
  Field,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  Slot,
  Input,
  HintText,
  AddVariableButton,
};

export type {
  RootProps as RichTextEditorRootProps,
  ToolbarButtonProps as RichTextEditorToolbarButtonProps,
  SlotProps as RichTextEditorSlotProps,
  InputProps as RichTextEditorInputProps,
  AddVariableButtonProps as RichTextEditorAddVariableButtonProps,
};
