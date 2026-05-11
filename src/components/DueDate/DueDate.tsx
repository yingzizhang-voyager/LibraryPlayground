import { Calendar } from "lucide-react";
import { Checkbox } from "../Checkbox";
import { SegmentedControl } from "../SegmentedControl";
import { Selector, type SelectorOption } from "../Selector";
import { TextInput } from "../TextInput";
import { ToggleSwitch } from "../ToggleSwitch";

/* ────────────────────────────────────────────────────────────────
 * DueDate — section pattern for configuring a workflow step's due date.
 *
 * Maps to Figma "Due Date Section" component set (4 variants by Type):
 *   • None         — toggle only (off)
 *   • Since start  — toggle + segmented + [amount · unit · "after step starts"] + Exclude weekends
 *   • On date      — toggle + segmented + ["Due by" · date picker]
 *   • From a field — toggle + segmented + [amount · unit · before|after · field] + Exclude weekends
 * ──────────────────────────────────────────────────────────── */

export type DueDateMode = "since-start" | "on-date" | "from-field";
export type DueDateDirection = "before" | "after";

export interface DueDateValue {
  enabled: boolean;
  mode: DueDateMode;
  /** "Since start" / "From a field" — numeric offset (string for input compatibility). */
  amount: string;
  /** "Since start" / "From a field" — unit token. */
  unit: string;
  /** "Since start" / "From a field" — toggle that excludes Sat/Sun from the offset count. */
  excludeWeekends: boolean;
  /** "On date" — absolute date (yyyy-mm-dd from the native date input). */
  date: string;
  /** "From a field" — direction relative to the referenced field. */
  direction: DueDateDirection;
  /** "From a field" — id of the referenced field. */
  fieldId: string;
}

export const DUE_DATE_DEFAULT: DueDateValue = {
  enabled: false,
  mode: "since-start",
  amount: "1",
  unit: "day",
  excludeWeekends: false,
  date: "",
  direction: "before",
  fieldId: "",
};

const MODE_OPTIONS: { value: DueDateMode; label: string }[] = [
  { value: "since-start", label: "Since start" },
  { value: "on-date",     label: "On date" },
  { value: "from-field",  label: "From a field" },
];

const UNIT_OPTIONS: SelectorOption[] = [
  { value: "day",  label: "day(s)" },
  { value: "hour", label: "hour(s)" },
  { value: "week", label: "week(s)" },
];

const DIRECTION_OPTIONS: SelectorOption[] = [
  { value: "before", label: "before" },
  { value: "after",  label: "after"  },
];

const DEFAULT_FIELD_OPTIONS: SelectorOption[] = [
  { value: "due-date",   label: "Due date" },
  { value: "start-date", label: "Start date" },
  { value: "created-at", label: "Created at" },
];

export interface DueDateProps {
  value: DueDateValue;
  onValueChange: (v: DueDateValue) => void;
  /** Field options for the "From a field" variant. Defaults to a small placeholder list. */
  fieldOptions?: SelectorOption[];
  /** Hide the "Exclude weekends" checkbox. Defaults to false (checkbox shown). */
  hideExcludeWeekends?: boolean;
  className?: string;
}

export function DueDate({
  value,
  onValueChange,
  fieldOptions = DEFAULT_FIELD_OPTIONS,
  hideExcludeWeekends = false,
  className,
}: DueDateProps) {
  const set = <K extends keyof DueDateValue>(key: K, v: DueDateValue[K]) =>
    onValueChange({ ...value, [key]: v });

  return (
    <div className={["flex flex-col gap-2", className].filter(Boolean).join(" ")}>
      {/* Toggle row — same in every variant */}
      <div className="flex items-center justify-between px-1 pt-1">
        <span className="text-body text-foreground">Due date</span>
        <ToggleSwitch
          checked={value.enabled}
          onCheckedChange={(b) => set("enabled", b)}
          aria-label="Toggle due date"
        />
      </div>

      {value.enabled && (
        <div className="flex flex-col gap-1">
          <SegmentedControl
            value={value.mode}
            onValueChange={(m) => set("mode", m as DueDateMode)}
          >
            {MODE_OPTIONS.map((o) => (
              <SegmentedControl.Item key={o.value} value={o.value}>
                {o.label}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl>

          {value.mode === "since-start" && (
            <div className="flex flex-col gap-2 rounded-lg bg-muted p-2">
              <div className="flex items-center gap-2">
                <div className="w-20">
                  <TextInput.Root
                    value={value.amount}
                    onValueChange={(v) => set("amount", v)}
                  >
                    <TextInput.Field>
                      <TextInput.Input type="number" min={1} />
                    </TextInput.Field>
                  </TextInput.Root>
                </div>
                <div className="w-28">
                  <Selector.Root
                    value={value.unit}
                    onValueChange={(v) => set("unit", v)}
                  >
                    <Selector.Field options={UNIT_OPTIONS} />
                  </Selector.Root>
                </div>
                <span className="text-body text-label-secondary">
                  after step starts
                </span>
              </div>
              {!hideExcludeWeekends && (
                <label className="inline-flex items-center gap-2 text-body text-foreground">
                  <Checkbox
                    checked={value.excludeWeekends}
                    onCheckedChange={(b) => set("excludeWeekends", b)}
                  />
                  Exclude weekends
                </label>
              )}
            </div>
          )}

          {value.mode === "on-date" && (
            <div className="flex items-center gap-3 rounded-lg bg-muted p-2">
              <span className="shrink-0 px-2 text-body text-foreground">
                Due by
              </span>
              <div className="flex-1">
                <TextInput.Root
                  value={value.date}
                  onValueChange={(v) => set("date", v)}
                >
                  <TextInput.Field>
                    <TextInput.Slot side="left">
                      <Calendar size={16} strokeWidth={1.6} />
                    </TextInput.Slot>
                    <TextInput.Input type="date" placeholder="Select date" />
                  </TextInput.Field>
                </TextInput.Root>
              </div>
            </div>
          )}

          {value.mode === "from-field" && (
            <div className="flex flex-col gap-2 rounded-lg bg-muted p-2">
              <div className="flex items-center gap-2">
                <div className="w-16">
                  <TextInput.Root
                    value={value.amount}
                    onValueChange={(v) => set("amount", v)}
                  >
                    <TextInput.Field>
                      <TextInput.Input type="number" min={1} />
                    </TextInput.Field>
                  </TextInput.Root>
                </div>
                <div className="w-24">
                  <Selector.Root
                    value={value.unit}
                    onValueChange={(v) => set("unit", v)}
                  >
                    <Selector.Field options={UNIT_OPTIONS} />
                  </Selector.Root>
                </div>
                <div className="w-24">
                  <Selector.Root
                    value={value.direction}
                    onValueChange={(v) => set("direction", v as DueDateDirection)}
                  >
                    <Selector.Field options={DIRECTION_OPTIONS} />
                  </Selector.Root>
                </div>
                <div className="flex-1">
                  <Selector.Root
                    value={value.fieldId}
                    onValueChange={(v) => set("fieldId", v)}
                  >
                    <Selector.Field
                      options={fieldOptions}
                      placeholder="Select date field"
                    />
                  </Selector.Root>
                </div>
              </div>
              {!hideExcludeWeekends && (
                <label className="inline-flex items-center gap-2 text-body text-foreground">
                  <Checkbox
                    checked={value.excludeWeekends}
                    onCheckedChange={(b) => set("excludeWeekends", b)}
                  />
                  Exclude weekends
                </label>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
