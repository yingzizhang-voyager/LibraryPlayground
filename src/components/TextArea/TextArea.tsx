import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type HTMLAttributes,
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
      `<TextArea.${component}> must be rendered inside <TextArea.Root>`,
    );
  }
  return ctx;
}

/* ────────────────────────────────────────────────────────────────
 * Root — provides state context + lays out Label / Field / HintText
 * ──────────────────────────────────────────────────────────── */

interface RootProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  size?: Size;
  /** Controlled HTML value. Pair with `onValueChange`. */
  value?: string;
  /** Initial HTML value for uncontrolled usage. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  /** Shows a `*` after the label. */
  required?: boolean;
  error?: boolean;
  /** Green border + green `HintText` (extends Figma; not a native variant). */
  success?: boolean;
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
  const inputId = id ?? `ta-${auto}`;

  return (
    <Ctx.Provider
      value={{
        size,
        disabled,
        readOnly,
        required,
        error,
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

/* ── Label ─────────────────────────────────────────────────────── */

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
 * Field — bordered surface wrapping Input (multiline)
 * ──────────────────────────────────────────────────────────── */

function Field({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { disabled, error, success, readOnly } = useCtx("Field");

  return (
    <div
      className={cx(
        "relative w-full overflow-hidden rounded-lg bg-white border",
        "transition-[box-shadow,border-color] duration-150",
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
 * Input — contentEditable multiline region with placeholder overlay
 *
 * Auto-grows with content (contentEditable height = scrollHeight).
 * `maxRows` / `maxHeight` caps the height (then internal scrollbar).
 * `minRows` sets the initial / minimum height.
 *
 * Accepts HTML strings (for badge support: <span data-badge="user|ddr">…</span>).
 * ──────────────────────────────────────────────────────────── */

interface InputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onInput"> {
  placeholder?: string;
  name?: string;
  /** Minimum visible rows (initial height). Default 3. */
  minRows?: number;
  /** Maximum rows before scrolling kicks in. Default 8. */
  maxRows?: number;
  /** Override `maxRows` with an explicit pixel cap. */
  maxHeight?: number;
}

function Input({
  placeholder,
  name,
  minRows = 4,
  maxRows = 8,
  maxHeight,
  className,
  style,
  ...rest
}: InputProps) {
  const { value, setValue, disabled, readOnly, error, inputId, size } =
    useCtx("Input");
  const ref = useRef<HTMLDivElement>(null);
  const isEmpty = !value || value === "<br>";

  // Sync external value changes into the contentEditable DOM
  useEffect(() => {
    const el = ref.current;
    if (el && el.innerHTML !== value) el.innerHTML = value;
  }, [value]);

  const handleInput = useCallback(
    (e: FormEvent<HTMLDivElement>) => {
      if (readOnly) return;
      setValue((e.target as HTMLDivElement).innerHTML);
    },
    [readOnly, setValue],
  );

  // Line-height per size, in rem (matches text-{caption,body,larger-body}).
  // sm = 16, md = 20, lg = 24 px → 1 / 1.25 / 1.5 rem at 16px base.
  const lineHeightRem = size === "sm" ? 1 : size === "lg" ? 1.5 : 1.25;
  // Vertical padding totals: sm 12 / md 16 / lg 20 px → 0.75 / 1 / 1.25 rem.
  const verticalPaddingRem = size === "sm" ? 0.75 : size === "md" ? 1 : 1.25;
  const minHeightRem = lineHeightRem * minRows + verticalPaddingRem;
  const maxHeightRem = lineHeightRem * maxRows + verticalPaddingRem;
  const padding =
    size === "sm" ? "px-1.5 py-1.5" : size === "md" ? "px-2 py-2" : "px-3 py-2.5";

  const wrapperStyle: CSSProperties = {
    minHeight: `${minHeightRem}rem`,
    // `maxHeight` prop: if a number, treat as px override; otherwise use rem calc.
    maxHeight: maxHeight !== undefined ? maxHeight : `${maxHeightRem}rem`,
    ...style,
  };

  return (
    <div className={cx("relative overflow-y-auto", padding)} style={wrapperStyle}>
      {isEmpty && placeholder && (
        <span
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute select-none text-label-tertiary",
            padding,
            "left-0 top-0",
            size === "sm" && "text-caption",
            size === "md" && "text-body",
            size === "lg" && "text-larger-body",
          )}
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
        aria-readonly={readOnly || undefined}
        aria-invalid={error || undefined}
        contentEditable={!disabled && !readOnly}
        suppressContentEditableWarning
        onInput={handleInput}
        className={cx(
          "outline-none text-foreground whitespace-pre-wrap break-words",
          size === "sm" && "text-caption",
          size === "md" && "text-body",
          size === "lg" && "text-larger-body",
          disabled && "cursor-not-allowed text-label-tertiary",
          readOnly && "cursor-default",
          className,
        )}
        {...rest}
      />
    </div>
  );
}

/* ── HintText ──────────────────────────────────────────────────── */

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

export const TextArea = {
  Root,
  Label,
  Field,
  Input,
  HintText,
};

export type {
  RootProps as TextAreaRootProps,
  InputProps as TextAreaInputProps,
};
