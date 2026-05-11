import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";

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
 * RadioGroup — 16×16 indicator.
 *
 * Compound API:
 *   <RadioGroup value="x" onValueChange={fn}>
 *     <RadioGroup.Item value="x">Option X</RadioGroup.Item>
 *   </RadioGroup>
 * ──────────────────────────────────────────────────────────── */

interface CtxValue {
  value: string;
  setValue: (v: string) => void;
  disabled: boolean;
  name: string;
}
const Ctx = createContext<CtxValue | null>(null);
function useCtx() {
  const c = useContext(Ctx);
  if (!c) throw new Error("<RadioGroup.Item> must be inside <RadioGroup>");
  return c;
}

interface RootProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  /** Underlying form name. Auto-generated if omitted. */
  name?: string;
}

function Root({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  name,
  className,
  children,
  ...rest
}: RootProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = isControlled ? value ?? "" : internal;
  const setValue = useCallback(
    (v: string) => {
      if (!isControlled) setInternal(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange],
  );
  const auto = useId();
  const groupName = name ?? `rg-${auto}`;

  return (
    <Ctx.Provider value={{ value: current, setValue, disabled, name: groupName }}>
      <div
        role="radiogroup"
        aria-disabled={disabled || undefined}
        className={cx("flex flex-col gap-2 font-sans", className)}
        {...rest}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}

interface ItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "type"> {
  value: string;
}

const Item = forwardRef<HTMLButtonElement, ItemProps>(function Item(
  { value, disabled: itemDisabled, className, children, ...rest },
  ref,
) {
  const { value: groupValue, setValue, disabled: groupDisabled, name } = useCtx();
  const disabled = groupDisabled || itemDisabled;
  const selected = groupValue === value;

  return (
    <label
      className={cx(
        "inline-flex items-center gap-2 text-body text-foreground",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={selected}
        name={name}
        value={value}
        disabled={disabled}
        onClick={() => !disabled && setValue(value)}
        data-state={selected ? "checked" : "unchecked"}
        className={cx(
          "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-150",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-glacier",
          selected
            ? "border-2 bg-brand-action border-brand-action disabled:bg-border-tertiary disabled:border-border-tertiary"
            : "border bg-white border-border-secondary hover:border-border-primary disabled:bg-muted disabled:border-border-tertiary",
        )}
        {...rest}
      >
        {selected && (
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-white"
          />
        )}
      </button>
      <span className={disabled ? "text-label-tertiary" : undefined}>{children}</span>
    </label>
  );
});

export const RadioGroup = Object.assign(Root, { Item });
export type RadioGroupProps = RootProps;
export type RadioItemProps = ItemProps;
