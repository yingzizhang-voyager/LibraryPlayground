import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
} from "react";
import { X } from "lucide-react";

/* ────────────────────────────────────────────────────────────────
 * Helpers + context
 * ──────────────────────────────────────────────────────────── */

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

type Size = "sm" | "md" | "lg";

interface CtxValue {
  size: Size;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  error: boolean;
  success: boolean;
  inputId: string;
  value: string;
  setValue: (v: string) => void;
}

const Ctx = createContext<CtxValue | null>(null);

function useCtx(component: string): CtxValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error(
      `<TextInput.${component}> must be rendered inside <TextInput.Root>`,
    );
  }
  return ctx;
}

/* ────────────────────────────────────────────────────────────────
 * Root — provides state context + lays out Label / Field / HintText
 * ──────────────────────────────────────────────────────────── */

interface RootProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Visual size. Defaults to `"md"` (36px tall). */
  size?: Size;
  /** Controlled value. Pair with `onValueChange`. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  /** Shows a `*` after the label and sets `required` on the input. */
  required?: boolean;
  /** Red border + ring + red `HintText`. Overrides `success`. */
  error?: boolean;
  /** Green border + ring + green `HintText` (extends Figma; not a native variant). */
  success?: boolean;
  /** Explicit id for the inner `<input>`. Auto-generated otherwise. */
  id?: string;
}

function Root({
  size = "md",
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  success = false,
  id,
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

  const auto = useId();
  const inputId = id ?? `ti-${auto}`;

  return (
    <Ctx.Provider
      value={{
        size,
        disabled,
        readOnly,
        required,
        // error wins when both set
        error: error,
        success: !error && success,
        inputId,
        value: currentValue,
        setValue,
      }}
    >
      <div
        className={cx("flex w-full flex-col font-sans", className)}
        data-size={size}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-required={required || undefined}
        data-error={error || undefined}
        data-success={!error && success ? true : undefined}
        {...rest}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Label — text rendered above the field, wired to Input's id
 * ──────────────────────────────────────────────────────────── */

function Label({ className, children, ...rest }: HTMLAttributes<HTMLLabelElement>) {
  const { inputId, required } = useCtx("Label");
  return (
    <div className="mb-2 flex items-center gap-1 px-1">
      <label
        htmlFor={inputId}
        className={cx("text-body text-foreground", className)}
        {...rest}
      >
        {children}
      </label>
      {required && (
        <span aria-hidden="true" className="text-body text-error">*</span>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Field — bordered surface containing Slot(s) + Input
 * Visual state derived from CSS (`:hover`, `:focus-within`) + data-*
 * attributes set on Root.
 * ──────────────────────────────────────────────────────────── */

function Field({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { disabled, error, success, readOnly, size } = useCtx("Field");

  return (
    <div
      className={cx(
        // base
        "flex items-center w-full overflow-hidden rounded-lg bg-white border",
        "transition-[box-shadow,border-color] duration-150",
        // size — height + padding from Figma; itemSpacing 12 px between content and slot
        size === "sm" && "h-7 px-2 gap-2",
        size === "md" && "h-9 px-2 gap-3",
        size === "lg" && "h-11 px-3 gap-3",
        // state branches (mutually exclusive — disabled > readOnly > error/success > normal)
        disabled && "border-border-tertiary bg-muted",
        !disabled && readOnly && "border-border-tertiary bg-background",
        !disabled && !readOnly && error && [
          "border-error",
          "focus-within:shadow-[0_0_0_3px_var(--color-error-ring)]",
        ],
        !disabled && !readOnly && !error && success && [
          "border-success",
          "focus-within:shadow-[0_0_0_3px_var(--color-success-ring)]",
        ],
        !disabled && !readOnly && !error && !success && [
          "border-border-secondary",
          "hover:border-border-primary",
          "focus-within:border-brand-glacier focus-within:shadow-[0_0_0_3px_var(--color-brand-card-background)]",
        ],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Slot — left/right adornment inside the Field
 *
 * Renders text or icons. Marks itself `aria-hidden` + `pointer-events-none`
 * so it doesn't hijack focus; interactive descendants (e.g. password-toggle
 * <button>) should restore `pointer-events-auto` themselves.
 * ──────────────────────────────────────────────────────────── */

interface SlotProps extends HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right";
}

function Slot({ side = "left", className, children, ...rest }: SlotProps) {
  const { size } = useCtx("Slot");
  return (
    <div
      aria-hidden="true"
      className={cx(
        "inline-flex shrink-0 items-center gap-1 pointer-events-none select-none",
        "text-label-tertiary",
        size === "sm" ? "text-caption" : "text-body",
        side === "right" && "ml-auto",
        className,
      )}
      data-side={side}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Input — the actual <input> element
 * ──────────────────────────────────────────────────────────── */

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "size"> {
  /** Native input type. Defaults to `"text"`. */
  type?: InputHTMLAttributes<HTMLInputElement>["type"];
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = "text", className, onInput, ...rest },
  ref,
) {
  const { value, setValue, disabled, readOnly, required, error, success, inputId, size } =
    useCtx("Input");

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onInput?.(e as unknown as Parameters<NonNullable<typeof onInput>>[0]);
    },
    [setValue, onInput],
  );

  return (
    <input
      ref={ref}
      id={inputId}
      type={type}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      aria-invalid={error || undefined}
      aria-required={required || undefined}
      aria-describedby={
        // HintText below will pick this up if it sets a matching id; left
        // undefined here so the caller can wire it explicitly when needed.
        undefined
      }
      data-state={error ? "error" : success ? "success" : undefined}
      className={cx(
        // Strip the browser chrome — borders, ring, bg — Field owns the visual
        "min-w-0 flex-1 bg-transparent outline-none border-0 ring-0",
        "text-foreground placeholder:text-label-tertiary",
        // size → font + leading
        size === "sm" && "text-caption",
        size === "md" && "text-body",
        size === "lg" && "text-larger-body",
        // disabled / read-only cursor
        disabled && "cursor-not-allowed text-label-tertiary",
        readOnly && "cursor-default",
        className,
      )}
      {...rest}
    />
  );
});

/* ────────────────────────────────────────────────────────────────
 * HintText — message below the field (red on error, green on success)
 * ──────────────────────────────────────────────────────────── */

function HintText({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  const { error, success } = useCtx("HintText");
  return (
    <p
      role={error ? "alert" : undefined}
      className={cx(
        "mt-1 flex items-start gap-1 px-1 text-body",
        error
          ? "text-error"
          : success
            ? "text-success-label"
            : "text-label-tertiary",
        className,
      )}
      {...rest}
    >
      {error && <X size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />}
      <span>{children}</span>
    </p>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Public namespace export
 * ──────────────────────────────────────────────────────────── */

export const TextInput = {
  Root,
  Label,
  Field,
  Slot,
  Input,
  HintText,
};

export type {
  RootProps as TextInputRootProps,
  SlotProps as TextInputSlotProps,
  InputProps as TextInputInputProps,
};
