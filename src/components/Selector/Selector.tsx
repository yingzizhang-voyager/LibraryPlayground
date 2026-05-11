import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Check, ChevronDown, Info, Search, X } from "lucide-react";

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
 * Selector — 1:1 with Figma component set `11707:10468` (Select).
 *
 * Two display modes:
 *   • Single-select (default): selected value rendered INSIDE the field
 *   • Multi-select (`multi`):  field stays a picker; selected items
 *                              render BELOW via <Selector.SelectedList>
 *                              (or the caller maps `values` to custom rows)
 *
 * Compound:
 *   <Selector.Root value={…} onValueChange={…} searchable>
 *     <Selector.Label>Unit</Selector.Label>
 *     <Selector.Field options={[…]} placeholder="Select…" />
 *   </Selector.Root>
 *
 *   <Selector.Root multi values={vs} onValuesChange={setVs}>
 *     <Selector.Label>Roles</Selector.Label>
 *     <Selector.Field options={[…]} placeholder="Add roles" />
 *     <Selector.SelectedList options={[…]} />
 *   </Selector.Root>
 * ──────────────────────────────────────────────────────────── */

export type SelectorSize = "sm" | "md" | "lg";

export interface SelectorOption {
  value: string;
  label: ReactNode;
  /** Secondary line (e.g. email) shown under the label in the dropdown. */
  sublabel?: ReactNode;
  /** Leading image / avatar / icon — accepts any node. */
  image?: ReactNode;
  /** Renders the option as inactive (strikethrough, muted). */
  inactive?: boolean;
  disabled?: boolean;
}

interface CtxValue {
  multi: boolean;
  searchable: boolean;
  size: SelectorSize;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  error: boolean;
  inputId: string;
  /** Current value (string for single, string[] for multi). */
  selected: Set<string>;
  toggle: (value: string) => void;
}

const Ctx = createContext<CtxValue | null>(null);
function useCtx(c: string): CtxValue {
  const v = useContext(Ctx);
  if (!v) throw new Error(`<Selector.${c}> must be inside <Selector.Root>`);
  return v;
}

/* ────────────────────────────────────────────────────────────────
 * Root
 * ──────────────────────────────────────────────────────────── */

interface RootProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Single-select value. Ignored when `multi`. Pair with `onValueChange`. */
  value?: string;
  defaultValue?: string;
  /** Multi-select values. Used when `multi`. */
  values?: string[];
  defaultValues?: string[];
  onValueChange?: (value: string) => void;
  onValuesChange?: (values: string[]) => void;
  multi?: boolean;
  searchable?: boolean;
  size?: SelectorSize;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  id?: string;
}

function Root({
  value,
  defaultValue,
  values,
  defaultValues,
  onValueChange,
  onValuesChange,
  multi = false,
  searchable = false,
  size = "md",
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  id,
  className,
  children,
  ...rest
}: RootProps) {
  // Internal state for uncontrolled
  const singleControlled = value !== undefined;
  const [singleInternal, setSingleInternal] = useState(defaultValue ?? "");
  const singleCurrent = singleControlled ? (value ?? "") : singleInternal;

  const multiControlled = values !== undefined;
  const [multiInternal, setMultiInternal] = useState<string[]>(defaultValues ?? []);
  const multiCurrent = multiControlled ? (values ?? []) : multiInternal;

  const selected = useMemo(
    () => new Set(multi ? multiCurrent : singleCurrent ? [singleCurrent] : []),
    [multi, multiCurrent, singleCurrent],
  );

  const toggle = useCallback(
    (v: string) => {
      if (disabled || readOnly) return;
      if (multi) {
        const next = multiCurrent.includes(v)
          ? multiCurrent.filter((x) => x !== v)
          : [...multiCurrent, v];
        if (!multiControlled) setMultiInternal(next);
        onValuesChange?.(next);
      } else {
        const next = singleCurrent === v ? "" : v;
        if (!singleControlled) setSingleInternal(next);
        onValueChange?.(next);
      }
    },
    [
      disabled,
      readOnly,
      multi,
      multiCurrent,
      multiControlled,
      onValuesChange,
      singleCurrent,
      singleControlled,
      onValueChange,
    ],
  );

  const auto = useId();
  const inputId = id ?? `sel-${auto}`;

  return (
    <Ctx.Provider
      value={{
        multi,
        searchable,
        size,
        disabled,
        readOnly,
        required,
        error,
        inputId,
        selected,
        toggle,
      }}
    >
      <div
        className={cx("flex w-full flex-col font-sans", className)}
        data-size={size}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-error={error || undefined}
        {...rest}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}

/* ── Label ─────────────────────────────────────────────────────── */

interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  /** Show an info `(i)` icon after the label (caller wires a tooltip externally). */
  infoIcon?: boolean;
  infoLabel?: string;
}

function Label({ className, children, infoIcon, infoLabel, ...rest }: LabelProps) {
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
      {infoIcon && (
        <Info
          aria-label={infoLabel ?? "More info"}
          size={14}
          strokeWidth={1.6}
          className="text-label-tertiary"
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Field — bordered trigger + popover dropdown
 * ──────────────────────────────────────────────────────────── */

const TRIGGER_SIZE: Record<SelectorSize, string> = {
  sm: "min-h-7 px-2 gap-2 text-caption",
  md: "min-h-9 px-2 gap-3 text-body",
  lg: "min-h-11 px-3 gap-3 text-body",
};

interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SelectorOption[];
  placeholder?: string;
  /** Override max popover height. Number = px; string = any CSS length (e.g. "20rem"). */
  popoverMaxHeight?: number | string;
  /** Empty state message inside the dropdown. */
  emptyMessage?: string;
}

function Field({
  options,
  placeholder = "Select…",
  popoverMaxHeight = "17.5rem", // 280 at 16px base
  emptyMessage = "No results",
  className,
  ...rest
}: FieldProps) {
  const {
    multi,
    searchable,
    size,
    disabled,
    readOnly,
    error,
    inputId,
    selected,
    toggle,
  } = useCtx("Field");

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    if (searchable) {
      // Focus search input when opened
      requestAnimationFrame(() => searchRef.current?.focus());
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, searchable]);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => {
      const text = `${typeof o.label === "string" ? o.label : ""} ${typeof o.sublabel === "string" ? o.sublabel : ""}`;
      return text.toLowerCase().includes(q);
    });
  }, [options, query]);

  const selectedOptions = useMemo(
    () => options.filter((o) => selected.has(o.value)),
    [options, selected],
  );

  // Multi mode: field is always a picker — never inline chips.
  // Single mode: field shows the picked option inline.
  const showPlaceholder = multi || selected.size === 0;
  const showChevron = !readOnly;

  return (
    <div ref={wrapperRef} className={cx("relative w-full font-sans", className)} {...rest}>
      <button
        ref={triggerRef}
        type="button"
        id={inputId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        aria-invalid={error || undefined}
        disabled={disabled}
        onClick={() => !disabled && !readOnly && setOpen((o) => !o)}
        className={cx(
          "flex w-full items-center rounded-lg bg-white border py-1 transition-[box-shadow,border-color] duration-150",
          TRIGGER_SIZE[size],
          // state colours (mutually exclusive — disabled > readOnly > error > normal)
          disabled && "border-border-tertiary bg-muted",
          !disabled && readOnly && "border-border-tertiary bg-background",
          !disabled && !readOnly && error && "border-error",
          !disabled && !readOnly && error && open && "shadow-[0_0_0_3px_var(--color-error-ring)]",
          !disabled && !readOnly && !error && "border-border-secondary",
          !disabled && !readOnly && !error && !open && "hover:border-border-primary",
          !disabled && !readOnly && !error && open &&
            "border-brand-glacier shadow-[0_0_0_3px_var(--color-brand-card-background)]",
          "disabled:cursor-not-allowed",
        )}
      >
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          {showPlaceholder ? (
            <span className="truncate text-label-tertiary">{placeholder}</span>
          ) : (
            // Single-select inline rendering (image leading + label)
            <span className="inline-flex min-w-0 items-center gap-2">
              {selectedOptions[0]?.image && (
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
                  {selectedOptions[0].image}
                </span>
              )}
              <span
                className={cx(
                  "truncate",
                  selectedOptions[0]?.inactive && "text-label-tertiary line-through",
                )}
              >
                {selectedOptions[0]?.label}
              </span>
            </span>
          )}
        </div>
        {showChevron && (
          <ChevronDown
            size={16}
            strokeWidth={1.6}
            aria-hidden="true"
            className={cx(
              "shrink-0 text-label-tertiary transition-transform",
              open && "rotate-180",
            )}
          />
        )}
      </button>

      {open && !disabled && !readOnly && (
        <div
          role="listbox"
          aria-multiselectable={multi || undefined}
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border-secondary bg-white shadow-lg"
          style={{ maxHeight: popoverMaxHeight }}
        >
          {searchable && (
            <div className="flex items-center gap-2 border-b border-border-tertiary px-3 py-2">
              <Search size={14} strokeWidth={1.6} className="text-label-tertiary" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent text-body text-foreground outline-none placeholder:text-label-tertiary"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="text-label-tertiary hover:text-foreground"
                >
                  <X size={14} strokeWidth={1.6} />
                </button>
              )}
            </div>
          )}
          <ul
            className="overflow-y-auto py-1"
            style={{
              // Subtract the search-bar height (~2.5rem) when present so the
              // list never exceeds `popoverMaxHeight` together with it.
              maxHeight: searchable
                ? `calc(${typeof popoverMaxHeight === "number" ? `${popoverMaxHeight}px` : popoverMaxHeight} - 2.5rem)`
                : popoverMaxHeight,
            }}
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-center text-body text-label-tertiary">
                {emptyMessage}
              </li>
            ) : (
              filtered.map((opt) => (
                <Option
                  key={opt.value}
                  opt={opt}
                  isSelected={selected.has(opt.value)}
                  onSelect={() => {
                    toggle(opt.value);
                    if (!multi) setOpen(false);
                  }}
                />
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * SelectedList — multi-select results rendered below the Field.
 *
 *   <Selector.Root multi …>
 *     <Selector.Field … />
 *     <Selector.SelectedList options={…} />
 *   </Selector.Root>
 *
 * Each row: image (if any) + label + remove ✕. For domain-specific rows
 * (e.g. assignee cards with index + colored bar), render your own list
 * using `values` from state instead of using SelectedList.
 * ──────────────────────────────────────────────────────────── */

interface SelectedListProps extends HTMLAttributes<HTMLUListElement> {
  options: SelectorOption[];
  /** Custom row renderer. Falls back to a default row when omitted. */
  renderItem?: (option: SelectorOption, index: number) => ReactNode;
  /** Hide the ✕ remove button on each row. */
  removable?: boolean;
  /** Empty-state hint shown when nothing is selected. */
  emptyMessage?: ReactNode;
}

function SelectedList({
  options,
  renderItem,
  removable = true,
  emptyMessage,
  className,
  ...rest
}: SelectedListProps) {
  const { selected, toggle, disabled, readOnly } = useCtx("SelectedList");
  const rows = options.filter((o) => selected.has(o.value));

  if (rows.length === 0) {
    return emptyMessage ? (
      <div className="mt-2 px-1 text-body text-label-tertiary">{emptyMessage}</div>
    ) : null;
  }

  return (
    <ul className={cx("mt-2 flex flex-col gap-2", className)} {...rest}>
      {rows.map((opt, i) =>
        renderItem ? (
          <li key={opt.value}>{renderItem(opt, i)}</li>
        ) : (
          <li
            key={opt.value}
            className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2"
          >
            {opt.image && (
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
                {opt.image}
              </span>
            )}
            <span className="flex min-w-0 flex-1 flex-col">
              <span
                className={cx(
                  "truncate text-body",
                  opt.inactive ? "text-label-tertiary line-through" : "text-foreground",
                )}
              >
                {opt.label}
                {opt.inactive && <span className="ml-1 no-underline"> (Inactive)</span>}
              </span>
              {opt.sublabel && (
                <span className="truncate text-caption text-label-tertiary">
                  {opt.sublabel}
                </span>
              )}
            </span>
            {removable && !disabled && !readOnly && (
              <button
                type="button"
                onClick={() => toggle(opt.value)}
                aria-label={`Remove ${typeof opt.label === "string" ? opt.label : "item"}`}
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-label-tertiary hover:bg-hover hover:text-foreground"
              >
                <X size={14} strokeWidth={1.6} />
              </button>
            )}
          </li>
        ),
      )}
    </ul>
  );
}

/* ── Option (dropdown list row) ──────────────────────────────── */

function Option({
  opt,
  isSelected,
  onSelect,
}: {
  opt: SelectorOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <li
      role="option"
      aria-selected={isSelected}
      aria-disabled={opt.disabled || undefined}
      onClick={() => !opt.disabled && onSelect()}
      className={cx(
        "flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors",
        opt.disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:bg-hover",
        isSelected && "bg-brand-card-background hover:bg-brand-card-background",
      )}
    >
      {opt.image && (
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
          {opt.image}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span
          className={cx(
            "truncate text-body",
            opt.inactive
              ? "text-label-tertiary line-through"
              : "text-foreground",
          )}
        >
          {opt.label}
          {opt.inactive && (
            <span className="ml-1 no-underline"> (Inactive)</span>
          )}
        </span>
        {opt.sublabel && (
          <span className="truncate text-caption text-label-tertiary">{opt.sublabel}</span>
        )}
      </span>
      {isSelected && (
        <Check size={16} strokeWidth={1.6} className="shrink-0 text-brand-action" />
      )}
    </li>
  );
}

/* ── HintText ──────────────────────────────────────────────────── */

function HintText({ className, children, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  const { error } = useCtx("HintText");
  return (
    <p
      role={error ? "alert" : undefined}
      className={cx(
        "mt-1 flex items-start gap-1 px-1 text-body",
        error ? "text-error" : "text-label-tertiary",
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
 * Public namespace
 * ──────────────────────────────────────────────────────────── */

export const Selector = {
  Root,
  Label,
  Field,
  SelectedList,
  HintText,
};

export type {
  RootProps as SelectorRootProps,
  FieldProps as SelectorFieldProps,
  LabelProps as SelectorLabelProps,
  SelectedListProps as SelectorSelectedListProps,
};
