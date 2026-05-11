import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { Button } from "../Button";

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
 * SidePanel — right-anchored drawer with backdrop.
 *
 * Compound:
 *   <SidePanel open onOpenChange={…}>
 *     <SidePanel.Nav title="E-Sign" icon={<EsignIcon />} aiAction={…} />
 *     <SidePanel.Body>…</SidePanel.Body>
 *     <SidePanel.Footer>
 *       <Button size="lg" className="w-full">Next</Button>
 *     </SidePanel.Footer>
 *   </SidePanel>
 *
 * Behaviour:
 *   • backdrop click → onOpenChange(false)
 *   • Escape key      → onOpenChange(false)
 *   • body scroll is locked while open
 * ──────────────────────────────────────────────────────────── */

interface CtxValue {
  onClose: () => void;
}
const Ctx = createContext<CtxValue | null>(null);
function useCtx() {
  const c = useContext(Ctx);
  if (!c) throw new Error("<SidePanel.*> must be inside <SidePanel>");
  return c;
}

export interface SidePanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Panel width. Accepts any CSS length. Defaults to `"33.75rem"` (540 at 16px base). */
  width?: number | string;
  /** When true, render as an embedded card (no backdrop, no scroll lock, no Escape handler, no close-on-outside-click). Useful for split-view playgrounds. */
  inline?: boolean;
}

function Root({
  open,
  onOpenChange,
  width = "33.75rem",
  inline = false,
  className,
  children,
  ...rest
}: SidePanelProps) {
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    if (!open || inline) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, inline]);

  if (!open) return null;

  if (inline) {
    return (
      <Ctx.Provider value={{ onClose: close }}>
        <div
          role="region"
          style={{ width }}
          className={cx(
            "relative flex h-full flex-col bg-white font-sans",
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </Ctx.Provider>
    );
  }

  const onBackdrop = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close();
  };

  return (
    <Ctx.Provider value={{ onClose: close }}>
      <div
        role="presentation"
        onClick={onBackdrop}
        className="fixed inset-0 z-50 flex justify-end bg-scrim"
      >
        <div
          role="dialog"
          aria-modal="true"
          style={{ width }}
          className={cx(
            "relative flex h-full flex-col bg-white shadow-2xl font-sans",
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </div>
    </Ctx.Provider>
  );
}

/* ── Nav (top bar) ────────────────────────────────────────────── */

interface NavProps extends HTMLAttributes<HTMLDivElement> {
  /** Left icon — typically a 24×24 colored action-type block. */
  icon?: ReactNode;
  /** Title text. */
  title: string;
  /** Right-side action button (e.g. "Enhance with AI"). */
  aiAction?: ReactNode;
  /** Show the more "⋯" button. */
  more?: ReactNode;
  /** Hide the close button. */
  hideClose?: boolean;
}

function Nav({
  icon,
  title,
  aiAction,
  more,
  hideClose = false,
  className,
  ...rest
}: NavProps) {
  const { onClose } = useCtx();
  return (
    <header
      className={cx(
        "flex shrink-0 items-center gap-4 border-b border-border-secondary bg-white pl-5 pr-3",
        className,
      )}
      style={{ height: "3.25rem" /* 52 */ }}
      {...rest}
    >
      <div className="flex flex-1 items-center gap-2">
        {icon && <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center">{icon}</span>}
        <h2 className="text-larger-body font-regular text-foreground truncate">{title}</h2>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {more}
        {aiAction}
        {!hideClose && (
          <Button
            size="md"
            variant="ghost"
            aria-label="Close"
            onClick={onClose}
            className="px-0 w-8"
          >
            <X size={16} strokeWidth={1.6} />
          </Button>
        )}
      </div>
    </header>
  );
}

/* ── Body (scrolling content) ────────────────────────────────── */

function Body({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "flex-1 overflow-y-auto bg-white",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ── Footer (sticky bottom bar) ──────────────────────────────── */

function Footer({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <footer
      className={cx(
        "flex shrink-0 items-center gap-3 border-t border-border-secondary bg-white px-5 pt-3 pb-4",
        className,
      )}
      {...rest}
    >
      {children}
    </footer>
  );
}

/* ── Section + Divider helpers ───────────────────────────────── */

function Section({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <section className={cx("flex flex-col gap-4 px-5 py-6", className)} {...rest}>
      {children}
    </section>
  );
}

function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cx("px-5", className)}>
      <div className="h-px w-full bg-border-tertiary" />
    </div>
  );
}

export const SidePanel = Object.assign(Root, {
  Nav,
  Body,
  Footer,
  Section,
  SectionDivider,
});

export type SidePanelNavProps = NavProps;
