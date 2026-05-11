import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useRef,
  useState,
  type DragEvent,
  type HTMLAttributes,
} from "react";
import { FileUp, Loader2, Trash2 } from "lucide-react";
import { X } from "lucide-react";

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
 * FileUpload — 1:1 with Figma COMPONENT_SET `165:79937`.
 *
 * Compound:
 *   <FileUpload.Root value={file} onValueChange={fn} loading={bool}>
 *     <FileUpload.Zone accept=".pdf,.doc" error="Required field" />
 *   </FileUpload.Root>
 *
 * States (derived from props + drag events):
 *   Resting       — no file, no drag, no error
 *   Hover         — :hover on zone (CSS)
 *   Drop          — dragging file over zone
 *   Uploading     — loading=true + file present
 *   Uploaded      — file present, !loading, !disabled
 *   Error (Empty) — error set, no file → red zone border + error text below
 *   Error (Filled)— error set, file present → file card with red border + error subtext
 *   Cannot Remove — disabled=true + file present → muted bg, no remove button
 * ──────────────────────────────────────────────────────────── */

/* ── Helper: derive file "kind" and display metadata ─────────── */

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type FileKind = "pdf" | "image" | "doc" | "generic";

function kindFrom(file: File): FileKind {
  const t = file.type;
  if (t === "application/pdf") return "pdf";
  if (t.startsWith("image/")) return "image";
  if (t.includes("word") || t.includes("document")) return "doc";
  return "generic";
}

const KIND_BG: Record<FileKind, string> = {
  pdf:     "bg-shell-100 text-shell-700",
  image:   "bg-aquamarine-100 text-aquamarine-700",
  doc:     "bg-glacier-100 text-brand-glacier",
  generic: "bg-muted text-fill-primary",
};
const KIND_LABEL: Record<FileKind, string> = {
  pdf: "PDF", image: "IMG", doc: "DOC", generic: "FILE",
};

function FileThumbnail({ file }: { file: File }) {
  const kind = kindFrom(file);
  return (
    <div
      className={cx(
        "flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-sm text-[0.5625rem] font-mono font-regular tracking-wide",
        KIND_BG[kind],
      )}
    >
      <span className="font-mono text-[0.625rem]">{KIND_LABEL[kind]}</span>
    </div>
  );
}

/* ── Context ──────────────────────────────────────────────────── */

interface CtxValue {
  file: File | null;
  setFile: (f: File | null) => void;
  disabled: boolean;
  loading: boolean;
}
const Ctx = createContext<CtxValue | null>(null);
function useCtx() {
  const c = useContext(Ctx);
  if (!c) throw new Error("<FileUpload.Zone> must be inside <FileUpload.Root>");
  return c;
}

/* ── Root ─────────────────────────────────────────────────────── */

interface RootProps extends HTMLAttributes<HTMLDivElement> {
  /** Controlled file value. Pair with `onValueChange`. */
  value?: File | null;
  defaultValue?: File;
  onValueChange?: (file: File | null) => void;
  /** Shows uploading spinner + disables remove while in progress. */
  loading?: boolean;
  disabled?: boolean;
}

function Root({
  value,
  defaultValue,
  onValueChange,
  loading = false,
  disabled = false,
  className,
  children,
  ...rest
}: RootProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<File | null>(defaultValue ?? null);
  const file = isControlled ? (value ?? null) : internal;

  const setFile = useCallback(
    (f: File | null) => {
      if (!isControlled) setInternal(f);
      onValueChange?.(f);
    },
    [isControlled, onValueChange],
  );

  return (
    <Ctx.Provider value={{ file, setFile, disabled, loading }}>
      <div className={cx("flex flex-col gap-2 font-sans", className)} {...rest}>
        {children}
      </div>
    </Ctx.Provider>
  );
}

/* ── Zone ─────────────────────────────────────────────────────── */

interface ZoneProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Native file input accept string, e.g. `".pdf,.doc,.docx"`. */
  accept?: string;
  /**
   * Placeholder text shown in the empty zone.
   * @default "Upload document to sign"
   */
  placeholder?: string;
  /**
   * Error condition:
   * - `true` → shows "Required field" error
   * - `string` → shows that string as the error
   * - `false` / `undefined` → no error
   */
  error?: boolean | string;
}

const Zone = forwardRef<HTMLDivElement, ZoneProps>(function Zone(
  { accept, placeholder = "Upload document to sign", error, className, ...rest },
  ref,
) {
  const { file, setFile, disabled, loading } = useCtx();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const hasFile   = !!file;
  const hasError  = !!error;
  const errorMsg  = typeof error === "string" ? error : "Required field";

  /* ── File selection handlers ──────────────────────────────── */
  const pick = useCallback(() => {
    if (!disabled && !loading) inputRef.current?.click();
  }, [disabled, loading]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setFile(files[0]);
    },
    [setFile],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files),
    [handleFiles],
  );

  /* ── Drag events ──────────────────────────────────────────── */
  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !loading) setDragging(true);
  }, [disabled, loading]);

  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      if (!disabled && !loading) handleFiles(e.dataTransfer.files);
    },
    [disabled, loading, handleFiles],
  );

  /* ── Shared zone container styles ────────────────────────── */
  const containerBase = cx(
    "relative w-full rounded-lg border transition-colors duration-150",
  );

  /* ── Empty zone (no file) ─────────────────────────────────── */
  if (!hasFile) {
    return (
      <div className={cx("flex flex-col gap-1", className)} ref={ref} {...rest}>
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-label={placeholder}
          onClick={pick}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pick()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cx(
            containerBase,
            "flex h-[5.25rem] cursor-pointer items-center justify-center",
            /* drop state */
            dragging
              ? "bg-brand-background border-brand-glacier shadow-[0_0_0_3px_var(--color-brand-background)]"
              : hasError
                ? "bg-white border-error"
                : [
                  "bg-white border-border-secondary",
                  !disabled && "hover:border-border-primary",
                ],
            disabled && "cursor-not-allowed bg-muted border-border-tertiary",
          )}
        >
          <div className="flex items-center gap-1">
            <FileUp
              size={20}
              strokeWidth={1.6}
              aria-hidden="true"
              className={cx(
                dragging
                  ? "text-brand-glacier"
                  : hasError
                    ? "text-error"
                    : disabled
                      ? "text-label-tertiary"
                      : "text-brand-glacier",
              )}
            />
            <span
              className={cx(
                "text-body",
                disabled ? "text-label-tertiary" : "text-foreground",
              )}
            >
              {placeholder}
            </span>
          </div>
        </div>

        {/* Error hint text below the zone */}
        {hasError && !disabled && (
          <p className="flex items-start gap-1 px-1 text-body text-error">
            <X size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={onInputChange}
          disabled={disabled}
        />
      </div>
    );
  }

  /* ── Filled zone (file selected) ─────────────────────────── */
  const isErrorFilled = hasError && !disabled;
  const isDisabled    = disabled;

  return (
    <div className={cx("flex flex-col gap-1", className)} ref={ref} {...rest}>
      <div
        className={cx(
          containerBase,
          "flex items-center px-6 py-5 gap-3",
          isErrorFilled
            ? "bg-white border-error"
            : isDisabled
              ? "bg-muted border-border-tertiary"
              : "bg-white border-border-secondary",
        )}
      >
        {/* File thumbnail */}
        <FileThumbnail file={file} />

        {/* File info */}
        <div className="min-w-0 flex-1">
          <div className="truncate text-body text-foreground">{file.name}</div>
          <div
            className={cx(
              "text-caption",
              isErrorFilled ? "text-error" : "text-label-tertiary",
            )}
          >
            {isErrorFilled ? errorMsg : formatBytes(file.size)}
          </div>
        </div>

        {/* Right action: spinner | trash | nothing */}
        {loading && (
          <Loader2
            size={20}
            strokeWidth={1.6}
            aria-hidden="true"
            className="shrink-0 animate-spin text-brand-action"
          />
        )}
        {!loading && !disabled && (
          <button
            type="button"
            onClick={() => setFile(null)}
            aria-label={`Remove ${file.name}`}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-error hover:bg-error-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-error"
          >
            <Trash2 size={16} strokeWidth={1.6} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={onInputChange}
        disabled={disabled}
      />
    </div>
  );
});

/* ── Public export ────────────────────────────────────────────── */

export const FileUpload = Object.assign(Root, { Zone });
export type { RootProps as FileUploadRootProps, ZoneProps as FileUploadZoneProps };
