/* Internal helpers for foundation stories. Not exported from the package. */
import type { ReactNode } from "react";

/* ── Swatch ───────────────────────────────────────────────────── */

interface SwatchProps {
  /** CSS color value to render, e.g. `var(--color-basalt-400)`. */
  color: string;
  /** Token name without the `--color-` prefix, e.g. "basalt-400". */
  name: string;
  /** Optional override label (e.g. the original Figma path). */
  figmaName?: string;
  /** Width of the swatch in px. */
  size?: number;
  /** Display the swatch's bounding outline (for very pale colors). */
  outlined?: boolean;
}

export function Swatch({
  color,
  name,
  figmaName,
  size = 88,
  outlined = false,
}: SwatchProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="rounded-md"
        style={{
          background: color,
          width: size,
          height: size,
          boxShadow: outlined
            ? "inset 0 0 0 1px var(--color-border-secondary)"
            : undefined,
        }}
      />
      <div className="flex flex-col gap-px">
        <code className="text-tiny font-mono text-label-primary">{name}</code>
        <code className="text-tiny font-mono text-label-tertiary">
          {resolveHex(color)}
        </code>
        {figmaName && (
          <code className="text-tiny text-label-quaternary">{figmaName}</code>
        )}
      </div>
    </div>
  );
}

/* ── Section heading ──────────────────────────────────────────── */

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-section-title text-label-heading">{title}</h2>
        {description && (
          <p className="text-body text-label-tertiary">{description}</p>
        )}
      </header>
      {children}
    </section>
  );
}

/* ── Group: a sub-row inside a section ────────────────────────── */

export function Group({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-caption font-mono uppercase text-label-tertiary tracking-wide">
        {title}
      </h3>
      <div className="flex flex-wrap gap-5">{children}</div>
    </div>
  );
}

/* ── Page wrapper ─────────────────────────────────────────────── */

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[1280px] space-y-10 bg-white-background p-8 font-sans text-label-primary">
      {children}
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────────────── */

/**
 * Resolve a CSS color expression (`#3E3C3A`, `var(--color-foreground)`,
 * `rgb(…)`, etc.) to a normalised hex string for display under the swatch.
 * Falls back to the raw input when resolution isn't possible (SSR).
 */
export function resolveHex(input: string): string {
  if (typeof window === "undefined") return input;
  const el = document.createElement("span");
  el.style.color = input;
  document.body.appendChild(el);
  const computed = getComputedStyle(el).color;
  document.body.removeChild(el);
  return rgbStringToHex(computed) || input;
}

function rgbStringToHex(rgb: string): string | null {
  // matches "rgb(r, g, b)" or "rgba(r, g, b, a)"
  const m = rgb.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(",").map((p) => p.trim());
  const [r, g, b] = parts.map((p) => parseFloat(p));
  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
  const toHex = (n: number) =>
    Math.round(n).toString(16).padStart(2, "0").toUpperCase();
  if (a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${+a.toFixed(3)})`;
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
