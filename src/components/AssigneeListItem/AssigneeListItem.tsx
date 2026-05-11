import { forwardRef, type HTMLAttributes } from "react";
import { GripVertical, X } from "lucide-react";
import { Avatar } from "../Avatar";

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
 * AssigneeListItem — 1:1 with Figma COMPONENT_SET `177:89583`
 *
 * Drag behaviour:
 *   • The entire card is the drag handle (listeners applied to card div)
 *   • GripVertical icon is purely visual, absolutely positioned on the
 *     left, fades in on hover — pointer-events: none
 *   • PointerSensor uses activationConstraint { distance: 8 } in the
 *     parent AssigneeList so remove-button clicks still fire normally
 *
 * Action:
 *   "E-Sign"  → 6 px color bar (absolute left-0) + order badge
 *   "Default" → plain full-width rounded card, no bar, no badge
 *
 * Sequential:
 *   true  → step number (E-Sign) or plain card (Default) + drag on hover
 *   false → dot badge (E-Sign only) + no drag affordance
 * ──────────────────────────────────────────────────────────── */

export interface AssigneeListItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  action?: "E-Sign" | "Default";
  sequential?: boolean;
  /** 1-based step shown in the order badge (E-Sign + sequential). */
  index?: number;
  name: string;
  initials?: string;
  src?: string;
  color?: string;
  accentColor?: string;
  removable?: boolean;
  onRemove?: () => void;
  isDragging?: boolean;
  /** Listeners from dnd-kit useSortable — spread onto the card div. */
  dragHandleListeners?: Record<string, unknown>;
  /** ARIA attributes from dnd-kit useSortable — spread onto the card div. */
  dragHandleAttributes?: Record<string, unknown>;
}

export const AssigneeListItem = forwardRef<HTMLDivElement, AssigneeListItemProps>(
  function AssigneeListItem(
    {
      action = "Default",
      sequential = false,
      index,
      name,
      initials,
      src,
      color,
      accentColor = "var(--color-butter-400)",
      removable = true,
      onRemove,
      isDragging = false,
      dragHandleListeners,
      dragHandleAttributes,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const isESign = action === "E-Sign";
    const avatarInitials = (initials ?? name.charAt(0)).toUpperCase();

    return (
      <div
        ref={ref}
        style={style}
        className={cx(
          "flex items-center font-sans",
          isESign && "gap-2",
          className,
        )}
        {...rest}
      >
        {/* ── Order badge (E-Sign only) ──────────────────────── */}
        {isESign && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-muted">
            {sequential ? (
              <span className="select-none text-caption text-label-secondary">
                {index ?? 1}
              </span>
            ) : (
              <div className="h-1.5 w-1.5 rounded-full bg-label-tertiary" />
            )}
          </div>
        )}

        {/* ── Card ──────────────────────────────────────────── */}
        {/*
         * When sequential, drag listeners go on the entire card div so
         * the user can grab anywhere to reorder. The grip icon is a
         * purely visual absolute overlay.
         */}
        <div
          className={cx(
            "group/card relative flex flex-1 items-center gap-3 overflow-hidden bg-muted",
            "transition-colors hover:bg-travertine-250",
            isESign
              ? "rounded-l-sm rounded-r-lg pl-[22px] pr-4 py-3"
              : "rounded-lg px-4 py-3",
            sequential && !isDragging && "cursor-grab",
            isDragging && "cursor-grabbing shadow-[0_1px_4px_rgba(0,0,0,0.16)]",
          )}
          {...(sequential ? (dragHandleListeners as Record<string, unknown>) : {})}
          {...(sequential ? (dragHandleAttributes as Record<string, unknown>) : {})}
        >
          {/* Color bar (E-Sign only) */}
          {isESign && (
            <div
              className="absolute left-0 top-0 h-full w-1.5"
              style={{ background: accentColor }}
              aria-hidden="true"
            />
          )}

          {/* Drag grip — absolute left, visual-only, fades in on hover */}
          {sequential && (
            <div
              className={cx(
                "pointer-events-none absolute top-1/2 -translate-y-1/2 text-label-tertiary",
                "opacity-0 transition-opacity group-hover/card:opacity-100",
                isESign ? "left-[7px]" : "left-1",
              )}
              aria-hidden="true"
            >
              <GripVertical size={14} strokeWidth={1.6} />
            </div>
          )}

          {/* Avatar */}
          <Avatar
            type={src ? "Image" : "Initial"}
            size={32}
            initials={avatarInitials}
            src={src}
            alt={name}
            color={color}
            className="shrink-0"
          />

          {/* Name */}
          <span className="min-w-0 flex-1 truncate text-body text-foreground">
            {name}
          </span>

          {/* Remove button — independently clickable (drag threshold prevents conflict) */}
          {removable && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${name}`}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-label-tertiary opacity-0 transition-opacity hover:bg-hover hover:text-foreground group-hover/card:opacity-100 focus-visible:opacity-100"
            >
              <X size={14} strokeWidth={1.6} />
            </button>
          )}
        </div>
      </div>
    );
  },
);
