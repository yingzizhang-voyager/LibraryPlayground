import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";

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
 * Collapsible — disclosure widget.
 *
 * Compound:
 *   <Collapsible defaultOpen>
 *     <Collapsible.Trigger>Advanced settings</Collapsible.Trigger>
 *     <Collapsible.Content>…</Collapsible.Content>
 *   </Collapsible>
 * ──────────────────────────────────────────────────────────── */

interface CtxValue {
  open: boolean;
  setOpen: (next: boolean) => void;
  triggerId: string;
  contentId: string;
  disabled: boolean;
}
const Ctx = createContext<CtxValue | null>(null);
function useCtx(component: string) {
  const c = useContext(Ctx);
  if (!c) throw new Error(`<Collapsible.${component}> must be inside <Collapsible>`);
  return c;
}

interface RootProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

function Root({
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  children,
  ...rest
}: RootProps) {
  const isControlled = open !== undefined;
  const [internal, setInternal] = useState(defaultOpen);
  const current = isControlled ? !!open : internal;
  const setOpen = useCallback(
    (next: boolean) => {
      if (disabled) return;
      if (!isControlled) setInternal(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange, disabled],
  );

  const id = useId();
  return (
    <Ctx.Provider
      value={{
        open: current,
        setOpen,
        triggerId: `cl-t-${id}`,
        contentId: `cl-c-${id}`,
        disabled,
      }}
    >
      <div
        data-state={current ? "open" : "closed"}
        className={cx("font-sans", className)}
        {...rest}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}

/* ── Trigger ──────────────────────────────────────────────────── */

function Trigger({
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen, triggerId, contentId, disabled } = useCtx("Trigger");
  return (
    <button
      type="button"
      id={triggerId}
      aria-controls={contentId}
      aria-expanded={open}
      disabled={disabled}
      onClick={() => setOpen(!open)}
      className={cx(
        "inline-flex items-center gap-1 text-body text-foreground",
        "hover:text-label-heading transition-colors",
        "disabled:cursor-not-allowed disabled:text-label-tertiary",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-glacier",
        className,
      )}
      {...rest}
    >
      {children}
      <ChevronDown
        size={16}
        strokeWidth={1.6}
        aria-hidden="true"
        className={cx("transition-transform duration-150", open && "rotate-180")}
      />
    </button>
  );
}

/* ── Content ──────────────────────────────────────────────────── */

function Content({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const { open, triggerId, contentId } = useCtx("Content");
  if (!open) return null;
  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      className={cx("mt-3", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export const Collapsible = Object.assign(Root, { Trigger, Content });
export type CollapsibleProps = RootProps;
