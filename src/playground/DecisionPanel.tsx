import { useState } from "react";
import { ChevronDown, GripVertical, Plus, Sparkles, X } from "lucide-react";
import { TextInput } from "../components/TextInput";
import { RichTextEditor } from "../components/RichTextEditor";
import { Button } from "../components/Button";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { Collapsible } from "../components/Collapsible";
import { SidePanel } from "../components/SidePanel";
import { Selector, type SelectorOption } from "../components/Selector";

/* ── Action icon ────────────────────────────────────────────────── */
function DecisionIcon() {
  return (
    <div
      className="flex h-6 w-6 items-center justify-center rounded-md text-white"
      style={{ background: "var(--color-flow-decision)" }}
      aria-hidden="true"
    >
      {/* diamond / fork shape */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1L13 7L7 13L1 7L7 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ── Choice color palette ───────────────────────────────────────── */
const COLORS = [
  "bg-basalt-400",
  "bg-shell-600",
  "bg-jade-700",
  "bg-brand-glacier",
  "bg-butter-500",
  "bg-flow-decision",
] as const;

type ChoiceColor = typeof COLORS[number];

interface Choice {
  id: string;
  label: string;
  colorIdx: number;
}

/* ── Choice row ──────────────────────────────────────────────────── */
function ChoiceRow({
  choice,
  onChange,
  onRemove,
}: {
  choice: Choice;
  onChange: (label: string, colorIdx: number) => void;
  onRemove: () => void;
}) {
  const color = COLORS[choice.colorIdx] as ChoiceColor;
  const cycleColor = () => onChange(choice.label, (choice.colorIdx + 1) % COLORS.length);

  return (
    <div className="flex items-center gap-2">
      <span className="cursor-grab text-label-tertiary" aria-hidden="true">
        <GripVertical size={16} strokeWidth={1.6} />
      </span>

      <TextInput.Root
        value={choice.label}
        onValueChange={(v) => onChange(v, choice.colorIdx)}
        className="flex-1"
      >
        <TextInput.Field>
          <TextInput.Input />
        </TextInput.Field>
      </TextInput.Root>

      {/* Color badge */}
      <button
        type="button"
        onClick={cycleColor}
        className={`inline-flex h-8 items-center gap-1 rounded-md px-2 text-white text-body font-regular transition-colors ${color}`}
        aria-label="Change choice color"
      >
        <span>Aa</span>
        <ChevronDown size={12} strokeWidth={2} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${choice.label}`}
        className="flex h-7 w-7 items-center justify-center rounded-md text-label-tertiary hover:bg-hover hover:text-foreground"
      >
        <X size={14} strokeWidth={1.6} />
      </button>
    </div>
  );
}

/* ── Suggested setup callout ─────────────────────────────────────── */
function SuggestedSetup({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-lg border border-dashed border-brand-glacier bg-brand-background px-4 py-3">
      <div className="flex items-start gap-3">
        <Sparkles
          size={16}
          strokeWidth={1.6}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-brand-glacier"
        />
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-caption text-brand-glacier">Suggested setup</span>
          <p className="text-body text-foreground">
            Add advise to show a recommendation before the assignee acts
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="shrink-0 text-body text-brand-action hover:underline"
        >
          Add advise
        </button>
      </div>
    </div>
  );
}

/* ── Assignee options (single-select for Decision) ──────────────── */
const ASSIGNEE_OPTIONS: SelectorOption[] = [
  {
    value: "client",
    label: "Client",
    image: (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-butter-500 text-caption font-regular text-white">
        C
      </span>
    ),
  },
  {
    value: "rm",
    label: "Relationship Manager",
    image: (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-jade-700 text-caption font-regular text-white">
        RM
      </span>
    ),
  },
  {
    value: "it",
    label: "IT Support",
    image: (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-shell-600 text-caption font-regular text-white">
        IS
      </span>
    ),
  },
];

/* ── Panel ──────────────────────────────────────────────────────── */
interface DecisionPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inline?: boolean;
}

let nextId = 1;

export function DecisionPanel({ open, onOpenChange, inline = false }: DecisionPanelProps) {
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [dueDateOn, setDueDateOn]     = useState(false);
  const [assignee, setAssignee]       = useState("client");

  const [choices, setChoices] = useState<Choice[]>([
    { id: "c1", label: "Approve", colorIdx: 0 },
    { id: "c2", label: "Decline", colorIdx: 1 },
  ]);

  const addChoice = () => {
    setChoices((prev) => [
      ...prev,
      { id: `c${++nextId}`, label: "New option", colorIdx: 3 },
    ]);
  };

  const updateChoice = (id: string, label: string, colorIdx: number) =>
    setChoices((prev) =>
      prev.map((c) => (c.id === id ? { ...c, label, colorIdx } : c)),
    );

  const removeChoice = (id: string) =>
    setChoices((prev) => prev.filter((c) => c.id !== id));

  return (
    <SidePanel
      open={open}
      onOpenChange={onOpenChange}
      inline={inline}
      width={inline ? "100%" : undefined}
    >
      <SidePanel.Nav
        icon={<DecisionIcon />}
        title="Decision"
        aiAction={
          <Button
            variant="outline"
            size="md"
            leftIcon={<Sparkles size={16} strokeWidth={1.6} />}
          >
            Enhance with AI
          </Button>
        }
      />

      <SidePanel.Body>
        {/* ─── Basic info ─────────────────────────────────────── */}
        <SidePanel.Section>
          <TextInput.Root value={name} onValueChange={setName} required>
            <TextInput.Label>Name</TextInput.Label>
            <TextInput.Field>
              <TextInput.Input placeholder="Name this action" />
            </TextInput.Field>
          </TextInput.Root>

          <RichTextEditor.Root value={description} onValueChange={setDescription}>
            <RichTextEditor.Label>Description</RichTextEditor.Label>
            <RichTextEditor.Field>
              <RichTextEditor.Toolbar>
                <RichTextEditor.ToolbarButton action="bold" />
                <RichTextEditor.ToolbarButton action="italic" />
                <RichTextEditor.ToolbarButton action="underline" />
                <RichTextEditor.ToolbarSeparator />
                <RichTextEditor.ToolbarButton action="alignLeft" />
                <RichTextEditor.ToolbarButton action="bullets" />
                <RichTextEditor.ToolbarButton action="numbered" />
                <RichTextEditor.Slot side="right">
                  <RichTextEditor.AddVariableButton />
                </RichTextEditor.Slot>
              </RichTextEditor.Toolbar>
              <RichTextEditor.Input placeholder="e.g. Pick the option that best describes your situation." />
            </RichTextEditor.Field>
          </RichTextEditor.Root>

          {/* Due date */}
          <div className="flex items-center justify-between">
            <span className="text-body text-foreground">Due date</span>
            <ToggleSwitch checked={dueDateOn} onCheckedChange={setDueDateOn} aria-label="Toggle due date" />
          </div>
        </SidePanel.Section>

        <SidePanel.SectionDivider />

        {/* ─── Choice options ──────────────────────────────────── */}
        <SidePanel.Section>
          <div className="flex flex-col gap-1">
            <h3 className="text-larger-body font-regular text-label-heading">Choice</h3>
            <p className="text-body text-label-secondary">
              Add the options assignees choose from. Each can let users continue the flow,
              branch to specific steps.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {choices.map((choice) => (
              <ChoiceRow
                key={choice.id}
                choice={choice}
                onChange={(label, colorIdx) => updateChoice(choice.id, label, colorIdx)}
                onRemove={() => removeChoice(choice.id)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addChoice}
            className="inline-flex items-center gap-1.5 self-start text-body text-brand-action hover:underline"
          >
            <Plus size={14} strokeWidth={2} aria-hidden="true" />
            Add choice button
          </button>
        </SidePanel.Section>

        <SidePanel.SectionDivider />

        {/* ─── Suggested setup callout ─────────────────────────── */}
        <SidePanel.Section>
          <SuggestedSetup onAdd={() => {}} />
        </SidePanel.Section>

        <SidePanel.SectionDivider />

        {/* ─── Assignees (single) ──────────────────────────────── */}
        <SidePanel.Section>
          <h3 className="text-larger-body font-regular text-label-heading">Choice</h3>

          <div className="flex flex-col gap-2">
            <span className="px-1 text-body text-foreground">
              Assignees <span className="text-error">*</span>
            </span>
            <Selector.Root value={assignee} onValueChange={setAssignee}>
              <Selector.Field options={ASSIGNEE_OPTIONS} />
            </Selector.Root>
          </div>
        </SidePanel.Section>

        <SidePanel.SectionDivider />

        {/* ─── Advanced settings ───────────────────────────────── */}
        <SidePanel.Section>
          <Collapsible>
            <Collapsible.Trigger>
              <span className="text-larger-body font-regular text-label-heading">
                Advanced settings
              </span>
            </Collapsible.Trigger>
            <Collapsible.Content className="mt-4">
              <p className="text-body text-label-tertiary">No additional settings.</p>
            </Collapsible.Content>
          </Collapsible>
        </SidePanel.Section>
      </SidePanel.Body>

      <SidePanel.Footer>
        <Button size="lg" variant="outline" className="flex-1" onClick={() => {}}>
          Preview action
        </Button>
        <Button size="lg" className="flex-1" onClick={() => onOpenChange(false)}>
          Save
        </Button>
      </SidePanel.Footer>
    </SidePanel>
  );
}
