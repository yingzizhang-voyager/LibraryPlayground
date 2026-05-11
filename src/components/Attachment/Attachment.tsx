import { forwardRef, type HTMLAttributes } from "react";
import { Loader2, RefreshCw, X } from "lucide-react";

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
 * Attachment — 1:1 with Figma component set `165:79112` (Attachment).
 *
 * Compact file row for displaying an attached file. States:
 *   View      — resting; remove button hidden until hover
 *   Hover     — CSS hover; reveals remove (X) button
 *   Uploading — spinner replaces action button
 *   Error     — error-bg, subtitle turns red, retry + remove shown
 *
 * Usage:
 *   <Attachment fileName="report.pdf" fileSize="1.2 MB" onRemove={fn} />
 *   <Attachment fileName="photo.jpg" loading />
 *   <Attachment fileName="doc.docx" error="Upload failed" onRetry={fn} onRemove={fn} />
 * ──────────────────────────────────────────────────────────── */

type FileType = "pdf" | "image" | "doc" | "generic";

function typeFromName(name: string): FileType {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"].includes(ext)) return "image";
  if (["doc", "docx"].includes(ext)) return "doc";
  return "generic";
}

const KIND_BG: Record<FileType, string> = {
  pdf:     "bg-shell-100 text-shell-700",
  image:   "bg-aquamarine-100 text-aquamarine-700",
  doc:     "bg-glacier-100 text-brand-glacier",
  generic: "bg-muted text-fill-primary",
};
const KIND_LABEL: Record<FileType, string> = {
  pdf: "PDF", image: "IMG", doc: "DOC", generic: "FILE",
};

export interface AttachmentProps extends HTMLAttributes<HTMLDivElement> {
  /** File name shown in the row. File type is inferred from the extension. */
  fileName: string;
  /** Formatted file size string, e.g. `"1.2 MB"`. */
  fileSize?: string;
  /** Show upload-in-progress spinner. */
  loading?: boolean;
  /**
   * Error state.
   * - `true` → shows "Upload failed"
   * - `string` → shows that string
   */
  error?: boolean | string;
  /** Called when the user clicks the remove (×) button. */
  onRemove?: () => void;
  /** Called when the user clicks the retry button in error state. */
  onRetry?: () => void;
}

export const Attachment = forwardRef<HTMLDivElement, AttachmentProps>(
  function Attachment(
    { fileName, fileSize, loading = false, error, onRemove, onRetry, className, ...rest },
    ref,
  ) {
    const hasError = !!error;
    const errorMsg = typeof error === "string" ? error : "Upload failed";
    const fileType = typeFromName(fileName);

    return (
      <div
        ref={ref}
        className={cx(
          "group relative flex w-full items-center gap-4 rounded-lg p-2 font-sans transition-colors duration-150",
          hasError
            ? "bg-error-bg"
            : "bg-white hover:bg-black/[0.05]",
          className,
        )}
        {...rest}
      >
        {/* Thumbnail */}
        <div
          className={cx(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded font-mono text-[0.625rem] tracking-wide",
            KIND_BG[fileType],
          )}
        >
          {KIND_LABEL[fileType]}
        </div>

        {/* File info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-body text-foreground">{fileName}</p>
          <p className={cx(
            "text-caption",
            !hasError && "font-light",
            hasError ? "text-error" : "text-label-secondary",
          )}>
            {hasError ? errorMsg : fileSize}
          </p>
        </div>

        {/* Right action */}
        {loading && (
          <Loader2
            size={20}
            strokeWidth={1.6}
            aria-hidden="true"
            className="shrink-0 animate-spin text-brand-action"
          />
        )}

        {!loading && hasError && (
          <div className="flex shrink-0 items-center gap-1">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                aria-label="Retry upload"
                className="inline-flex h-4 w-4 items-center justify-center rounded-[1px] text-error transition-colors hover:bg-error-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-error"
              >
                <RefreshCw size={10} strokeWidth={1.6} />
              </button>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${fileName}`}
                className="inline-flex h-4 w-4 items-center justify-center rounded-[1px] text-error transition-colors hover:bg-error-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-error"
              >
                <X size={10} strokeWidth={1.6} />
              </button>
            )}
          </div>
        )}

        {!loading && !hasError && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${fileName}`}
            className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[1px] text-label-tertiary opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-glacier"
          >
            <X size={10} strokeWidth={1.6} />
          </button>
        )}
      </div>
    );
  },
);
