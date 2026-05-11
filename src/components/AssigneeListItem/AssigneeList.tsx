import { forwardRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AssigneeListItem, type AssigneeListItemProps } from "./AssigneeListItem";

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

/* ── Item data shape ─────────────────────────────────────────── */

export interface AssigneeItemData {
  /** Stable unique ID (used as dnd-kit sort key). */
  id: string;
  name: string;
  initials?: string;
  src?: string;
  /** Avatar background color (Initial type). */
  color?: string;
  /** Left color bar override per item (E-Sign). Falls back to list-level `accentColor`. */
  accentColor?: string;
}

/* ── Internal sortable wrapper ───────────────────────────────── */

interface SortableItemProps extends Omit<AssigneeListItemProps, "dragHandleListeners" | "dragHandleAttributes" | "isDragging"> {
  id: string;
}

const SortableItem = forwardRef<HTMLDivElement, SortableItemProps>(
  function SortableItem({ id, ...props }, _ref) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    return (
      <AssigneeListItem
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          zIndex: isDragging ? 10 : undefined,
        }}
        isDragging={isDragging}
        dragHandleListeners={listeners as Record<string, unknown>}
        dragHandleAttributes={attributes as Record<string, unknown>}
        {...props}
      />
    );
  },
);

/* ── AssigneeList (public API) ───────────────────────────────── */

export interface AssigneeListProps {
  items: AssigneeItemData[];
  /** Called after a drag-and-drop reorder with the new ordered array. */
  onReorder?: (items: AssigneeItemData[]) => void;
  /** Called when a remove button is clicked. */
  onRemove?: (id: string) => void;
  /** "E-Sign" → color bar + order badge. "Default" → plain card. */
  action?: "E-Sign" | "Default";
  /**
   * true  → step numbers visible, drag handle appears on hover
   * false → dot badge (E-Sign), no drag handle
   */
  sequential?: boolean;
  /** Fallback left bar color when item.accentColor is not set (E-Sign). */
  accentColor?: string;
  /** Show remove buttons. Default true. */
  removable?: boolean;
  className?: string;
}

export function AssigneeList({
  items,
  onReorder,
  onRemove,
  action = "Default",
  sequential = false,
  accentColor,
  removable = true,
  className,
}: AssigneeListProps) {
  const sensors = useSensors(
    // Require 8 px of movement before drag starts — lets button clicks fire normally
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIdx = items.findIndex((i) => i.id === active.id);
      const newIdx = items.findIndex((i) => i.id === over.id);
      onReorder?.(arrayMove(items, oldIdx, newIdx));
    }
  };

  const ids = items.map((i) => i.id);

  const list = (
    <div className={cx("flex flex-col gap-2", className)}>
      {items.map((item, idx) =>
        sequential ? (
          <SortableItem
            key={item.id}
            id={item.id}
            action={action}
            sequential={sequential}
            index={idx + 1}
            name={item.name}
            initials={item.initials}
            src={item.src}
            color={item.color}
            accentColor={item.accentColor ?? accentColor}
            removable={removable}
            onRemove={() => onRemove?.(item.id)}
          />
        ) : (
          <AssigneeListItem
            key={item.id}
            action={action}
            sequential={false}
            index={idx + 1}
            name={item.name}
            initials={item.initials}
            src={item.src}
            color={item.color}
            accentColor={item.accentColor ?? accentColor}
            removable={removable}
            onRemove={() => onRemove?.(item.id)}
          />
        ),
      )}
    </div>
  );

  if (!sequential) return list;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {list}
      </SortableContext>
    </DndContext>
  );
}
