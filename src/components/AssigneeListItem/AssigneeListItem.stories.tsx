import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AssigneeListItem } from "./AssigneeListItem";
import { AssigneeList, type AssigneeItemData } from "./AssigneeList";

/* ── AssigneeListItem stories ────────────────────────────────── */

const meta: Meta<typeof AssigneeListItem> = {
  title: "Components/AssigneeListItem",
  component: AssigneeListItem,
  parameters: { layout: "padded" },
  decorators: [(Story) => <div className="max-w-lg font-sans"><Story /></div>],
  argTypes: {
    action:     { control: "inline-radio", options: ["Default", "E-Sign"] },
    sequential: { control: "boolean" },
    removable:  { control: "boolean" },
    isDragging: { control: "boolean" },
    name:       { control: "text" },
    initials:   { control: "text" },
    color:      { control: "color" },
    accentColor:{ control: "color" },
  },
  args: {
    name: "Role Name",
    initials: "R",
    action: "Default",
    sequential: false,
    removable: true,
  },
};
export default meta;
type Story = StoryObj<typeof AssigneeListItem>;

/* ── Figma variant matrix ─────────────────────────────────────── */

// Default
export const DefaultResting: Story = {};
export const DefaultHover:   Story = { parameters: { pseudo: { hover: true } } };
export const DefaultSequential: Story = { args: { sequential: true, index: 1 } };
export const DefaultSequentialHover: Story = {
  args: { sequential: true, index: 1 },
  parameters: { pseudo: { hover: true } },
};

// E-Sign Sequential=No (dot indicator)
export const ESignNoOrder: Story = {
  args: { action: "E-Sign", sequential: false, color: "var(--color-butter-500)", accentColor: "var(--color-butter-500)" },
};
export const ESignNoOrderHover: Story = {
  args: { action: "E-Sign", sequential: false, color: "var(--color-butter-500)", accentColor: "var(--color-butter-500)" },
  parameters: { pseudo: { hover: true } },
};

// E-Sign Sequential=Yes (step number + drag handle on hover)
export const ESignSequential: Story = {
  args: { action: "E-Sign", sequential: true, index: 1, color: "var(--color-butter-500)", accentColor: "var(--color-butter-500)" },
};
export const ESignSequentialHover: Story = {
  args: { action: "E-Sign", sequential: true, index: 1, color: "var(--color-butter-500)", accentColor: "var(--color-butter-500)" },
  parameters: { pseudo: { hover: true } },
};

// Move state (dragging)
export const Dragging: Story = {
  args: { action: "E-Sign", sequential: true, index: 2, isDragging: true, color: "var(--color-jade-700)", accentColor: "var(--color-jade-700)" },
};

/* ── AssigneeList live showcase ──────────────────────────────── */

const SAMPLE: AssigneeItemData[] = [
  { id: "client", name: "Client",               initials: "C",  color: "var(--color-butter-500)",    accentColor: "var(--color-butter-500)"    },
  { id: "rm",     name: "Relationship Manager", initials: "RM", color: "var(--color-jade-700)",      accentColor: "var(--color-jade-700)"      },
  { id: "it",     name: "IT Support",           initials: "IS", color: "var(--color-shell-600)",     accentColor: "var(--color-shell-600)"     },
  { id: "amanda", name: "Amanda Fernandez",     initials: "AF", color: "var(--color-brand-glacier)", accentColor: "var(--color-brand-glacier)" },
];

export const ListDefaultNoSequential: StoryObj = {
  name: "List / Default / Non-sequential",
  render: () => {
    const [items, setItems] = useState(SAMPLE);
    return (
      <div className="max-w-lg space-y-4 font-sans">
        <p className="text-caption text-label-tertiary">Hover to reveal remove button</p>
        <AssigneeList
          items={items}
          action="Default"
          sequential={false}
          onRemove={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
        />
      </div>
    );
  },
};

export const ListDefaultSequential: StoryObj = {
  name: "List / Default / Sequential (drag to reorder)",
  render: () => {
    const [items, setItems] = useState(SAMPLE);
    return (
      <div className="max-w-lg space-y-4 font-sans">
        <p className="text-caption text-label-tertiary">Hover to see drag handle · drag to reorder</p>
        <AssigneeList
          items={items}
          action="Default"
          sequential
          onReorder={setItems}
          onRemove={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
        />
      </div>
    );
  },
};

export const ListESignNoSequential: StoryObj = {
  name: "List / E-Sign / Non-sequential (dot + color bar)",
  render: () => {
    const [items, setItems] = useState(SAMPLE);
    return (
      <div className="max-w-lg space-y-4 font-sans">
        <AssigneeList
          items={items}
          action="E-Sign"
          sequential={false}
          onRemove={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
        />
      </div>
    );
  },
};

export const ListESignSequential: StoryObj = {
  name: "List / E-Sign / Sequential (step numbers + drag to reorder)",
  render: () => {
    const [items, setItems] = useState(SAMPLE);
    return (
      <div className="max-w-lg space-y-4 font-sans">
        <p className="text-caption text-label-tertiary">Drag to reorder signing order</p>
        <AssigneeList
          items={items}
          action="E-Sign"
          sequential
          onReorder={setItems}
          onRemove={(id) => setItems((prev) => prev.filter((i) => i.id !== id))}
        />
      </div>
    );
  },
};
