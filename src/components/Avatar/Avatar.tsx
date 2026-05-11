import type { HTMLAttributes } from "react";

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
 * Avatar — 1:1 with Figma COMPONENT_SET `11633:9075`.
 *
 * Usage:
 *   <Avatar type="Initial" size={32} initials="AF" color="var(--color-jade-700)" />
 *   <Avatar type="Image"   size={24} src="/photo.jpg" alt="Jane Doe" />
 *
 * Variant axes (match Figma exactly):
 *   type  — "Initial" | "Image"
 *   size  — 16 | 24 | 32
 * ──────────────────────────────────────────────────────────── */

export type AvatarType = "Initial" | "Image";
export type AvatarSize = 16 | 24 | 32;

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** "Initial" | "Image" — matches Figma "Type" variant axis. Default "Initial". */
  type?: AvatarType;
  /** 16 | 24 | 32 px — matches Figma "Size" variant axis. Default 32. */
  size?: AvatarSize;
  /** Initial type: 1–2 characters, rendered uppercase. */
  initials?: string;
  /** Initial type: background color (any CSS value). Default: #9FB3C8. */
  color?: string;
  /** Image type: image URL. */
  src?: string;
  /** Image type: alt text. */
  alt?: string;
}

const SIZE_CLASS: Record<AvatarSize, string> = {
  16: "h-4 w-4",
  24: "h-6 w-6",
  32: "h-8 w-8",
};

const FONT_SIZE: Record<AvatarSize, number> = {
  16: 8,
  24: 12,
  32: 16,
};

const DEFAULT_COLOR = "#9FB3C8";

export function Avatar({
  type = "Initial",
  size = 32,
  initials,
  color = DEFAULT_COLOR,
  src,
  alt = "",
  className,
  ...rest
}: AvatarProps) {
  const base = cx(
    "inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden",
    SIZE_CLASS[size],
    className,
  );

  if (type === "Image") {
    return (
      <span className={base} {...rest}>
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span
      className={cx(base, "font-regular text-white uppercase select-none leading-none")}
      style={{ background: color, fontSize: FONT_SIZE[size] }}
      aria-label={initials}
      {...rest}
    >
      {initials ?? "?"}
    </span>
  );
}
