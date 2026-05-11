import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { File, FileText, Image, Trash2 } from "lucide-react";

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
 * FileCard — file preview row used in upload UIs (e.g. E-sign
 * "Signing Document").
 *
 * Visual:
 *   • Outline card (1px border-secondary), radius-lg
 *   • Left: 40×48 file-type thumbnail (coloured by extension)
 *   • Middle: name (text-body, bold-ish) + size (text-caption muted)
 *   • Right: ✕/trash button
 * ──────────────────────────────────────────────────────────── */

export type FileKind = "pdf" | "image" | "doc" | "generic";

const KIND_BG: Record<FileKind, string> = {
  pdf: "bg-shell-100 text-shell-700",
  image: "bg-aquamarine-100 text-aquamarine-700",
  doc: "bg-glacier-100 text-brand-glacier",
  generic: "bg-muted text-fill-primary",
};

const KIND_LABEL: Record<FileKind, string> = {
  pdf: "PDF",
  image: "IMG",
  doc: "DOC",
  generic: "FILE",
};

function KindIcon({ kind, size = 18 }: { kind: FileKind; size?: number }) {
  switch (kind) {
    case "pdf":
      return <FileText size={size} strokeWidth={1.6} aria-hidden="true" />;
    case "image":
      return <Image size={size} strokeWidth={1.6} aria-hidden="true" />;
    case "doc":
      return <FileText size={size} strokeWidth={1.6} aria-hidden="true" />;
    default:
      return <File size={size} strokeWidth={1.6} aria-hidden="true" />;
  }
}

export interface FileCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  /** Human-readable size, e.g. `"180 KB"`. */
  size?: string;
  kind?: FileKind;
  /** Override the thumbnail with a custom node (e.g. real image preview). */
  thumbnail?: ReactNode;
  /** Render the delete (trash) button on the right. */
  removable?: boolean;
  onRemove?: () => void;
}

export const FileCard = forwardRef<HTMLDivElement, FileCardProps>(
  function FileCard(
    {
      name,
      size,
      kind = "generic",
      thumbnail,
      removable = true,
      onRemove,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx(
          "flex items-center gap-3 rounded-lg border border-border-secondary bg-white px-3 py-2 font-sans",
          className,
        )}
        {...rest}
      >
        {thumbnail ?? (
          <div
            className={cx(
              "flex h-12 w-10 shrink-0 flex-col items-center justify-center rounded-sm",
              KIND_BG[kind],
            )}
          >
            <KindIcon kind={kind} />
            <span className="mt-0.5 text-[0.5625rem] font-mono font-regular tracking-wide">
              {KIND_LABEL[kind]}
            </span>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="truncate text-body text-foreground">{name}</div>
          {size && <div className="text-caption text-label-tertiary">{size}</div>}
        </div>

        {removable && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${name}`}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-error hover:bg-error-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-error"
          >
            <Trash2 size={16} strokeWidth={1.6} />
          </button>
        )}
      </div>
    );
  },
);
