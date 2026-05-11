import { useState } from "react";
import { PenLine, Sparkles } from "lucide-react";
import { TextInput } from "../components/TextInput";
import { RichTextEditor } from "../components/RichTextEditor";
import { Button } from "../components/Button";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { Checkbox } from "../components/Checkbox";
import { RadioGroup } from "../components/RadioGroup";
import { SegmentedControl } from "../components/SegmentedControl";
import { Collapsible } from "../components/Collapsible";
import { SidePanel } from "../components/SidePanel";
import { FileUpload } from "../components/FileUpload";
import {
  AssigneeList,
  type AssigneeItemData,
} from "../components/AssigneeListItem";
import { Selector, type SelectorOption } from "../components/Selector";

/* ── E-Sign action-type icon ──────────────────────────────────── */
function EsignIcon() {
  return (
    <div
      className="flex h-6 w-6 items-center justify-center rounded-md text-white"
      style={{ background: "var(--color-flow-esign)" }}
      aria-hidden="true"
    >
      <PenLine size={14} strokeWidth={2} />
    </div>
  );
}

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

const DUE_DATE_OPTIONS = [
  { value: "since-start", label: "Since start" },
  { value: "on-date",     label: "On date" },
  { value: "from-field",  label: "From a field" },
];

const UNIT_OPTIONS: SelectorOption[] = [
  { value: "day",   label: "day(s)" },
  { value: "hour",  label: "hour(s)" },
  { value: "week",  label: "week(s)" },
];

const ROLE_OPTIONS: SelectorOption[] = [
  { value: "role-1",  label: "Role 1" },
  { value: "role-2",  label: "Role 2" },
  { value: "role-3",  label: "Role 3" },
  { value: "manager", label: "Flow Manager" },
];

/* ── Assignee catalogue (roles + users) ───────────────────────── */

interface AssigneeRecord extends SelectorOption {
  initials: string;
  color: string;     // avatar bg + left bar color
}

const ASSIGNEE_CATALOG: AssigneeRecord[] = [
  { value: "client", label: "Client",               initials: "C",  color: "var(--color-butter-500)",   image: <Avatar initial="C"  color="var(--color-butter-500)"   /> },
  { value: "rm",     label: "Relationship Manager", initials: "RM", color: "var(--color-jade-700)",     image: <Avatar initial="RM" color="var(--color-jade-700)"     /> },
  { value: "it",     label: "IT Support",           initials: "IS", color: "var(--color-shell-600)",    image: <Avatar initial="IS" color="var(--color-shell-600)"    /> },
  { value: "amanda", label: "Amanda Fernandez",     initials: "AF", color: "var(--color-brand-glacier)", sublabel: "amanda.fernandez@moxo.com", image: <Avatar initial="A" color="var(--color-brand-glacier)" /> },
  { value: "bruno",  label: "Bruno Fournier",       initials: "BF", color: "var(--color-quartz-500)",   sublabel: "bruno.fournier@moxo.com",   image: <Avatar initial="B" color="var(--color-quartz-500)"  /> },
  { value: "casey",  label: "Casey Lam",            initials: "CL", color: "var(--color-flow-form)",    sublabel: "casey.lam@moxo.com",        image: <Avatar initial="C" color="var(--color-flow-form)"   /> },
];

interface ESignPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ESignPanel({ open, onOpenChange }: ESignPanelProps) {
  const [name, setName] = useState("Lease agreement");
  const [description, setDescription] = useState(
    "Sign your lease agreement electronically to quickly and securely complete the process from anywhere.",
  );
  const [dueDateOn, setDueDateOn] = useState(true);
  const [dueDateMode, setDueDateMode] = useState("since-start");
  const [dueDateValue, setDueDateValue] = useState("1");
  const [dueDateUnit, setDueDateUnit] = useState("day");
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [sequential, setSequential] = useState(true);

  /** Ordered assignees — stored as AssigneeItemData so drag reorder persists. */
  const [assignees, setAssignees] = useState<AssigneeItemData[]>(() =>
    ["client", "rm", "it"].map((id) => {
      const rec = ASSIGNEE_CATALOG.find((o) => o.value === id)!;
      return { id, name: typeof rec.label === "string" ? rec.label : id, initials: rec.initials, color: rec.color, accentColor: rec.color };
    }),
  );
  const assigneeIds = assignees.map((a) => a.id);

  const [signingDoc, setSigningDoc] = useState<File | null>(null);

  const [folder, setFolder] = useState("");
  const [visibility, setVisibility] = useState("specific-roles");

  /** Multi-select roles → renders BELOW via Selector.SelectedList. */
  const [roles, setRoles] = useState<string[]>(["role-1", "role-2"]);

  return (
    <SidePanel open={open} onOpenChange={onOpenChange}>
      <SidePanel.Nav
        icon={<EsignIcon />}
        title="E-Sign"
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
        {/* ─── Section 1 · Basic info ────────────────────────── */}
        <SidePanel.Section>
          <TextInput.Root value={name} onValueChange={setName} required>
            <TextInput.Label>Name</TextInput.Label>
            <TextInput.Field>
              <TextInput.Input placeholder="Lease agreement" />
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
              <RichTextEditor.Input placeholder="Describe what assignees need to sign…" />
            </RichTextEditor.Field>
          </RichTextEditor.Root>

          <div className="flex flex-col gap-2">
            <span className="px-1 text-body text-foreground">
              Signing Document <span className="text-error">*</span>
            </span>
            <FileUpload value={signingDoc} onValueChange={setSigningDoc}>
              <FileUpload.Zone accept=".pdf,.doc,.docx" placeholder="Upload document to sign" />
            </FileUpload>
            <p className="px-1 text-body text-label-tertiary">
              Digital signatures with Certificate of Completion.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-border-secondary p-4">
            <div className="flex items-center justify-between">
              <span className="text-body text-foreground">Due date</span>
              <ToggleSwitch
                checked={dueDateOn}
                onCheckedChange={setDueDateOn}
                aria-label="Toggle due date"
              />
            </div>
            {dueDateOn && (
              <>
                <SegmentedControl value={dueDateMode} onValueChange={setDueDateMode}>
                  {DUE_DATE_OPTIONS.map((o) => (
                    <SegmentedControl.Item key={o.value} value={o.value}>
                      {o.label}
                    </SegmentedControl.Item>
                  ))}
                </SegmentedControl>

                <div className="flex items-center gap-2">
                  <div className="w-20">
                    <TextInput.Root value={dueDateValue} onValueChange={setDueDateValue}>
                      <TextInput.Field>
                        <TextInput.Input type="number" min={1} />
                      </TextInput.Field>
                    </TextInput.Root>
                  </div>
                  <div className="w-28">
                    <Selector.Root value={dueDateUnit} onValueChange={setDueDateUnit}>
                      <Selector.Field options={UNIT_OPTIONS} />
                    </Selector.Root>
                  </div>
                  <span className="text-body text-label-secondary">after step starts</span>
                </div>

                <label className="inline-flex items-center gap-2 text-body text-foreground">
                  <Checkbox checked={excludeWeekends} onCheckedChange={setExcludeWeekends} />
                  Exclude weekends
                </label>
              </>
            )}
          </div>
        </SidePanel.Section>

        <SidePanel.SectionDivider />

        {/* ─── Section 2 · Assignee selection (multi → list-below) ── */}
        <SidePanel.Section>
          <h3 className="text-section-title font-regular text-label-heading">Choice</h3>

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

            {/* Picker: multi-select, field stays as "Add assignee" trigger */}
            <Selector.Root
              multi
              searchable
              values={assigneeIds}
              onValuesChange={(ids) => {
                setAssignees((prev) => {
                  // Keep existing items in their order; append new ones
                  const kept = prev.filter((a) => ids.includes(a.id));
                  const added = ids
                    .filter((id) => !prev.find((a) => a.id === id))
                    .map((id) => {
                      const rec = ASSIGNEE_CATALOG.find((o) => o.value === id)!;
                      return { id, name: typeof rec.label === "string" ? rec.label : id, initials: rec.initials, color: rec.color, accentColor: rec.color };
                    });
                  return [...kept, ...added];
                });
              }}
            >
              <Selector.Field
                options={ASSIGNEE_CATALOG}
                placeholder="Add assignee"
              />
            </Selector.Root>

            {/* Assignee rows with E-Sign styling + DnD reorder when sequential */}
            <AssigneeList
              items={assignees}
              action="E-Sign"
              sequential={sequential}
              onReorder={setAssignees}
              onRemove={(id) => setAssignees((prev) => prev.filter((a) => a.id !== id))}
              className="mt-1"
            />
          </div>
        </SidePanel.Section>

        <SidePanel.SectionDivider />

        {/* ─── Section 3 · Advanced settings (collapsible) ────── */}
        <SidePanel.Section>
          <Collapsible defaultOpen>
            <Collapsible.Trigger>
              <span className="text-section-title font-regular text-label-heading">
                Advanced settings
              </span>
            </Collapsible.Trigger>

            <Collapsible.Content className="space-y-6 mt-4">
              <div className="flex flex-col gap-2">
                <span className="px-1 text-body text-foreground">File organization</span>
                <span className="px-1 text-body text-label-tertiary">
                  Save the signed file to a specific folder
                </span>
                <TextInput.Root value={folder} onValueChange={setFolder}>
                  <TextInput.Field>
                    <TextInput.Input placeholder="e.g. Client Documents" />
                  </TextInput.Field>
                </TextInput.Root>
                <p className="px-1 text-body text-label-tertiary">
                  Files will be automatically placed in this folder in the Files panel.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span className="px-1 text-body text-foreground">Action visibility</span>
                <RadioGroup value={visibility} onValueChange={setVisibility}>
                  <RadioGroup.Item value="only-assignees">Only assignees</RadioGroup.Item>
                  <RadioGroup.Item value="everyone">Everyone</RadioGroup.Item>
                  <RadioGroup.Item value="specific-roles">Specific roles</RadioGroup.Item>
                </RadioGroup>

                {visibility === "specific-roles" && (
                  <div className="mt-2">
                    {/* Multi-select with default SelectedList rendering below */}
                    <Selector.Root multi values={roles} onValuesChange={setRoles}>
                      <Selector.Field options={ROLE_OPTIONS} placeholder="Add roles…" />
                      <Selector.SelectedList options={ROLE_OPTIONS} />
                    </Selector.Root>
                    <p className="mt-1 px-1 text-body text-label-tertiary">
                      Assignees and flow managers see this by default. Add roles to grant
                      additional access.
                    </p>
                  </div>
                )}
              </div>
            </Collapsible.Content>
          </Collapsible>
        </SidePanel.Section>
      </SidePanel.Body>

      <SidePanel.Footer>
        <Button size="lg" className="w-full" onClick={() => onOpenChange(false)}>
          Next
        </Button>
      </SidePanel.Footer>
    </SidePanel>
  );
}
