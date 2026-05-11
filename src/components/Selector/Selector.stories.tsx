import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Selector, type SelectorOption } from "./Selector";

/**
 * Selector — 1:1 with Figma component set `11707:10468` (Select).
 *
 * Supports all four Filled Types from the Figma variant matrix:
 *   • Text                (single-select, no image)
 *   • Image Leading       (single-select, with avatar/icon)
 *   • Multi-Select Text   (chip-rendered multi-select)
 *   • Multi-Select Image  (chips with avatars)
 *
 * Plus `searchable`, `required`, `error`, `disabled`, `readOnly`, and
 * inactive-option styling.
 */

/* ── Demo data ─────────────────────────────────────────────────── */

function Avatar({ initial, color = "var(--color-brand-glacier)" }: { initial: string; color?: string }) {
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

const USERS: SelectorOption[] = [
  { value: "amanda",  label: "Amanda Fernandez", sublabel: "amanda.fernandez@moxo.com", image: <Avatar initial="A" color="var(--color-flow-esign)" /> },
  { value: "amit",    label: "Amit Patil",       sublabel: "amit.patil@moxo.com",       image: <Avatar initial="A" color="var(--color-flow-todo)" /> },
  { value: "anna",    label: "Anna Clark",       sublabel: "anna.clark@moxo.com",       image: <Avatar initial="A" color="var(--color-flow-approval)" /> },
  { value: "brenda",  label: "Brenda Rodrigues", sublabel: "brenda.rodrigues@moxo.com", image: <Avatar initial="B" color="var(--color-flow-questionnaire)" /> },
  { value: "bruno",   label: "Bruno Fournier",   sublabel: "bruno.fournier@moxo.com",   image: <Avatar initial="B" color="var(--color-flow-pdf-form)" /> },
  { value: "casey",   label: "Casey Lam",        sublabel: "casey.lam@moxo.com",        image: <Avatar initial="C" color="var(--color-flow-form)" /> },
  { value: "chris-inactive", label: "Chris Glasser", sublabel: "chris.glasser@moxo.com", image: <Avatar initial="C" color="var(--color-flow-acknowledgement)" />, inactive: true },
];

const MILESTONES: SelectorOption[] = Array.from({ length: 6 }, (_, i) => ({
  value: `m${i + 1}`,
  label: `Milestone ${i + 1}`,
}));

const TITLES: SelectorOption[] = Array.from({ length: 6 }, (_, i) => ({
  value: `t${i}`,
  label: "Title",
}));

const meta: Meta = {
  title: "Components/Selector",
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj;

/* ── Core variants ──────────────────────────────────────────── */

export const SingleText: Story = {
  render: () => {
    function Demo() {
      const [v, setV] = useState("");
      return (
        <div className="max-w-sm">
          <Selector.Root value={v} onValueChange={setV}>
            <Selector.Label>Label</Selector.Label>
            <Selector.Field options={TITLES} placeholder="Placeholder" />
          </Selector.Root>
        </div>
      );
    }
    return <Demo />;
  },
};

export const SingleImage: Story = {
  render: () => {
    function Demo() {
      const [v, setV] = useState("amanda");
      return (
        <div className="max-w-sm">
          <Selector.Root value={v} onValueChange={setV} searchable>
            <Selector.Label>Label</Selector.Label>
            <Selector.Field options={USERS} placeholder="Select assignee" />
          </Selector.Root>
        </div>
      );
    }
    return <Demo />;
  },
};

export const MultiText: Story = {
  render: () => {
    function Demo() {
      const [vs, setVs] = useState<string[]>(["m1", "m2"]);
      return (
        <div className="max-w-sm">
          <Selector.Root multi values={vs} onValuesChange={setVs}>
            <Selector.Label>Milestones</Selector.Label>
            <Selector.Field options={MILESTONES} placeholder="Select milestones" />
          </Selector.Root>
        </div>
      );
    }
    return <Demo />;
  },
};

export const MultiImage: Story = {
  render: () => {
    function Demo() {
      const [vs, setVs] = useState<string[]>(["amanda", "anna"]);
      return (
        <div className="max-w-sm">
          <Selector.Root multi searchable values={vs} onValuesChange={setVs}>
            <Selector.Label>Assignees</Selector.Label>
            <Selector.Field options={USERS} placeholder="Add assignees" />
          </Selector.Root>
        </div>
      );
    }
    return <Demo />;
  },
};

/* ── States ───────────────────────────────────────────────────── */

export const Required: Story = {
  render: () => (
    <div className="max-w-sm">
      <Selector.Root required>
        <Selector.Label>Assignee</Selector.Label>
        <Selector.Field options={USERS} placeholder="Pick one" />
      </Selector.Root>
    </div>
  ),
};

export const WithInfoIcon: Story = {
  render: () => (
    <div className="max-w-sm">
      <Selector.Root>
        <Selector.Label infoIcon infoLabel="What's an assignee?">Assignee</Selector.Label>
        <Selector.Field options={USERS} placeholder="Pick one" />
      </Selector.Root>
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className="max-w-sm">
      <Selector.Root error required>
        <Selector.Label>Assignee</Selector.Label>
        <Selector.Field options={USERS} placeholder="Pick one" />
        <Selector.HintText>Required field</Selector.HintText>
      </Selector.Root>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-sm">
      <Selector.Root disabled defaultValue="amanda">
        <Selector.Label>Assignee</Selector.Label>
        <Selector.Field options={USERS} />
      </Selector.Root>
    </div>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <div className="max-w-sm">
      <Selector.Root readOnly defaultValue="amanda">
        <Selector.Label>Assignee</Selector.Label>
        <Selector.Field options={USERS} />
      </Selector.Root>
    </div>
  ),
};

export const InactiveUsers: Story = {
  render: () => {
    function Demo() {
      const [vs, setVs] = useState<string[]>(["chris-inactive", "amanda"]);
      return (
        <div className="max-w-sm">
          <Selector.Root multi values={vs} onValuesChange={setVs}>
            <Selector.Label>Assignees</Selector.Label>
            <Selector.Field options={USERS} placeholder="Pick assignees" />
          </Selector.Root>
        </div>
      );
    }
    return <Demo />;
  },
};

/* ── Showcase: all 4 Filled Types side-by-side ──────────────── */

export const Showcase: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6 bg-background p-8 font-sans" style={{ maxWidth: 880 }}>
      <Selector.Root>
        <Selector.Label>Text · single</Selector.Label>
        <Selector.Field options={TITLES} placeholder="Placeholder" />
      </Selector.Root>

      <Selector.Root defaultValue="amanda" searchable>
        <Selector.Label>Image · single</Selector.Label>
        <Selector.Field options={USERS} placeholder="Pick assignee" />
      </Selector.Root>

      <Selector.Root multi defaultValues={["m1", "m2"]}>
        <Selector.Label>Multi · text</Selector.Label>
        <Selector.Field options={MILESTONES} placeholder="Select" />
      </Selector.Root>

      <Selector.Root multi searchable defaultValues={["amanda", "anna"]}>
        <Selector.Label>Multi · image</Selector.Label>
        <Selector.Field options={USERS} placeholder="Pick assignees" />
      </Selector.Root>

      <Selector.Root error required>
        <Selector.Label>Error</Selector.Label>
        <Selector.Field options={TITLES} placeholder="Placeholder" />
        <Selector.HintText>A short sentence case message</Selector.HintText>
      </Selector.Root>

      <Selector.Root disabled>
        <Selector.Label>Disabled</Selector.Label>
        <Selector.Field options={TITLES} placeholder="Placeholder" />
      </Selector.Root>
    </div>
  ),
};
