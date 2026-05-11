import { useState } from "react";
import { Sparkles } from "lucide-react";
import { TextInput } from "../components/TextInput";
import { RichTextEditor } from "../components/RichTextEditor";
import { Button } from "../components/Button";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { Collapsible } from "../components/Collapsible";
import { SidePanel } from "../components/SidePanel";
import { AssigneeList, type AssigneeItemData } from "../components/AssigneeListItem";
import { Selector, type SelectorOption } from "../components/Selector";

/* ── Action icon ────────────────────────────────────────────────── */
function TodoIcon() {
  return (
    <div
      className="flex h-6 w-6 items-center justify-center rounded-md text-white"
      style={{ background: "var(--color-flow-todo)" }}
      aria-hidden="true"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="3" width="12" height="1.5" rx="0.75" fill="white" />
        <rect x="1" y="6.5" width="12" height="1.5" rx="0.75" fill="white" />
        <rect x="1" y="10" width="8" height="1.5" rx="0.75" fill="white" />
      </svg>
    </div>
  );
}

/* ── Assignee catalogue ──────────────────────────────────────────── */
function Avatar({ initial, color }: { initial: string; color: string }) {
  return (
    <span
      className="flex h-full w-full items-center justify-center text-tiny font-regular text-white"
      style={{ background: color }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

interface AssigneeRecord extends SelectorOption {
  initials: string;
  color: string;
}

const ASSIGNEE_CATALOG: AssigneeRecord[] = [
  { value: "client", label: "Client",               initials: "C",  color: "var(--color-butter-500)",    image: <Avatar initial="C"  color="var(--color-butter-500)"   /> },
  { value: "rm",     label: "Relationship Manager", initials: "RM", color: "var(--color-jade-700)",      image: <Avatar initial="RM" color="var(--color-jade-700)"     /> },
  { value: "it",     label: "IT Support",           initials: "IS", color: "var(--color-shell-600)",     image: <Avatar initial="IS" color="var(--color-shell-600)"    /> },
  { value: "amanda", label: "Amanda Fernandez",     initials: "AF", color: "var(--color-brand-glacier)", image: <Avatar initial="A"  color="var(--color-brand-glacier)" /> },
  { value: "bruno",  label: "Bruno Fournier",       initials: "BF", color: "var(--color-quartz-500)",    image: <Avatar initial="B"  color="var(--color-quartz-500)"  /> },
];

function catalogToItem(id: string): AssigneeItemData {
  const rec = ASSIGNEE_CATALOG.find((o) => o.value === id)!;
  return { id, name: typeof rec.label === "string" ? rec.label : id, initials: rec.initials, color: rec.color };
}

/* ── Panel ──────────────────────────────────────────────────────── */
interface TodoPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inline?: boolean;
}

export function TodoPanel({ open, onOpenChange, inline = false }: TodoPanelProps) {
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [dueDateOn, setDueDateOn]     = useState(false);
  const [sequential, setSequential]   = useState(false);
  const [assignees, setAssignees]     = useState<AssigneeItemData[]>(() =>
    ["client", "rm"].map(catalogToItem),
  );
  const assigneeIds = assignees.map((a) => a.id);

  return (
    <SidePanel
      open={open}
      onOpenChange={onOpenChange}
      inline={inline}
      width={inline ? "100%" : undefined}
    >
      <SidePanel.Nav icon={<TodoIcon />} title="To-Do" />

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
                <RichTextEditor.ToolbarSeparator />
                <RichTextEditor.ToolbarButton action="attachment" />
                <RichTextEditor.Slot side="right">
                  <RichTextEditor.AddVariableButton />
                </RichTextEditor.Slot>
              </RichTextEditor.Toolbar>
              <RichTextEditor.Input placeholder="e.g. Mark each item once you have confirmed it on our end." />
            </RichTextEditor.Field>
          </RichTextEditor.Root>

          {/* Due date */}
          <div className="flex items-center justify-between">
            <span className="text-body text-foreground">Due date</span>
            <ToggleSwitch checked={dueDateOn} onCheckedChange={setDueDateOn} aria-label="Toggle due date" />
          </div>
        </SidePanel.Section>

        <SidePanel.SectionDivider />

        {/* ─── Who needs to do this? ───────────────────────────── */}
        <SidePanel.Section>
          <h3 className="text-larger-body font-regular text-label-heading">
            Who needs to do this?
          </h3>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="px-1 text-body text-foreground">
                Assignees <span className="text-error">*</span>
              </span>
              <label className="inline-flex items-center gap-2 text-body text-foreground">
                Sequential order
                <ToggleSwitch
                  checked={sequential}
                  onCheckedChange={setSequential}
                  aria-label="Sequential order"
                />
              </label>
            </div>

            <Selector.Root
              multi
              searchable
              values={assigneeIds}
              onValuesChange={(ids) =>
                setAssignees((prev) => {
                  const kept = prev.filter((a) => ids.includes(a.id));
                  const added = ids
                    .filter((id) => !prev.find((a) => a.id === id))
                    .map(catalogToItem);
                  return [...kept, ...added];
                })
              }
            >
              <Selector.Field options={ASSIGNEE_CATALOG} placeholder="Add assignee" />
            </Selector.Root>

            <AssigneeList
              items={assignees}
              action="Default"
              sequential={sequential}
              onReorder={setAssignees}
              onRemove={(id) => setAssignees((prev) => prev.filter((a) => a.id !== id))}
              removable
              className="mt-1"
            />
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
        <Button size="lg" className="w-full" onClick={() => onOpenChange(false)}>
          Save
        </Button>
      </SidePanel.Footer>
    </SidePanel>
  );
}
