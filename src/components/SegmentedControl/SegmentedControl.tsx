import {
  Children,
  Fragment,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
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
 * SegmentedControl — 1:1 with Figma component set `224:55010`.
 *
 * Compound:
 *   <SegmentedControl value="x" onValueChange={fn} layout="fill">
 *     <SegmentedControl.Item value="x">Label</SegmentedControl.Item>
 *     <SegmentedControl.Item value="y" icon={<SomeIcon />} />
 *   </SegmentedControl>
 *
 * Visual:
 *   • Track: 32px tall, rounded-lg (8px), bg-muted, 2px padding
 *   • Selected item: white pill, 0.5px subtle border, drop shadow
 *   • Unselected: transparent, muted text
 *   • No separators between items (hidden in Figma spec)
 * ──────────────────────────────────────────────────────────── */

interface CtxValue {
  value: string;
  setValue: (v: string) => void;
  disabled: boolean;
  layout: "fill" | "hug";
}
const Ctx = createContext<CtxValue | null>(null);
function useCtx() {
  const c = useContext(Ctx);
  if (!c) throw new Error("<SegmentedControl.Item> must be inside <SegmentedControl>");
  return c;
}

interface RootProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  /** `"fill"` stretches items equally; `"hug"` sizes each to its content. */
  layout?: "fill" | "hug";
}

function Root({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  layout = "fill",
  className,
  children,
  ...rest
}: RootProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(() => {
    if (defaultValue !== undefined) return defaultValue;
    const first = Children.toArray(children).find(isValidElement);
    return (first?.props as { value?: string })?.value ?? "";
  });
  const current = isControlled ? value ?? "" : internal;
  const setValue = useCallback(
    (v: string) => {
      if (!isControlled) setInternal(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange],
  );

  const items = Children.toArray(children);

  return (
    <Ctx.Provider value={{ value: current, setValue, disabled, layout }}>
      <div
        role="tablist"
        aria-disabled={disabled || undefined}
        data-layout={layout}
        className={cx(
          "inline-flex h-8 items-center gap-0 rounded-lg bg-muted p-0.5 font-sans",
          layout === "fill" && "w-full",
          className,
        )}
        {...rest}
      >
        {items.map((child, idx) => {
          if (!isValidElement(child)) return child;
          const props = child.props as { value?: string };
          const isSelected = current === props.value;
          const prev = items[idx - 1];
          const isAfterSelected =
            idx > 0 &&
            isValidElement(prev) &&
            (prev.props as { value?: string }).value === current;
          const showDivider = idx > 0 && !isSelected && !isAfterSelected;
          return (
            <Fragment key={idx}>
              {showDivider && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none relative flex-none w-0 min-w-0 self-stretch"
                >
                  <div className="absolute left-0 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 rounded-full bg-border-transparent" />
                </div>
              )}
              <div className={cx(layout === "fill" ? "flex-1" : "shrink-0")}>
                {child}
              </div>
            </Fragment>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

/* ── Item ─────────────────────────────────────────────────────── */

interface ItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "type"> {
  value: string;
  /** When provided, renders the icon instead of the label text. */
  icon?: ReactNode;
}

const Item = forwardRef<HTMLButtonElement, ItemProps>(function Item(
  { value, icon, className, children, disabled: itemDisabled, ...rest },
  ref,
) {
  const { value: groupValue, setValue, disabled: groupDisabled, layout } = useCtx();
  const disabled = groupDisabled || itemDisabled;
  const selected = groupValue === value;

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={selected}
      disabled={disabled}
      onClick={() => !disabled && setValue(value)}
      data-state={selected ? "active" : "inactive"}
      className={cx(
        "relative inline-flex h-7 items-center justify-center rounded-md px-3 text-body font-regular transition-colors duration-150",
        layout === "fill" && "w-full",
        selected
          ? "bg-white text-foreground shadow-[0_0_0_0.5px_rgba(34,32,31,0.10),0_1px_2px_0_rgba(0,0,0,0.05)]"
          : "bg-transparent text-label-secondary hover:bg-black/[0.04]",
        "disabled:cursor-not-allowed disabled:text-label-tertiary",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-glacier",
        className,
      )}
      {...rest}
    >
      {icon ?? children}
    </button>
  );
});

export const SegmentedControl = Object.assign(Root, { Item });
export type SegmentedControlProps = RootProps;
export type SegmentedControlItemProps = ItemProps;
