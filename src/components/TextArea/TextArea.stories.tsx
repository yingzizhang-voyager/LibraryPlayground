import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "./TextArea";

/**
 * Text Area — compound, multi-line text field with auto-grow and badge
 * support (user mentions / DDR references).
 *
 * Compose `TextArea.Root` with optional `Label`, the bordered `Field`
 * (containing `Input`), and optional `HintText`. The Input auto-grows
 * with content up to `maxRows` (or explicit `maxHeight`), then scrolls.
 *
 * Rich content (badges) is supplied as HTML strings to `value` /
 * `defaultValue` — see story #2.
 */

interface ShowcaseArgs {
  label?: string;
  placeholder?: string;
  hint?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  success?: boolean;
  defaultValue?: string;
  minRows?: number;
  maxRows?: number;
}

function StandardArea({
  label,
  placeholder = "Type a message…",
  hint,
  size = "md",
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  success = false,
  defaultValue,
  minRows = 4,
  maxRows = 8,
}: ShowcaseArgs) {
  return (
    <TextArea.Root
      size={size}
      defaultValue={defaultValue}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      error={error}
      success={success}
    >
      {label && <TextArea.Label>{label}</TextArea.Label>}
      <TextArea.Field>
        <TextArea.Input
          placeholder={placeholder}
          minRows={minRows}
          maxRows={maxRows}
        />
      </TextArea.Field>
      {hint && <TextArea.HintText>{hint}</TextArea.HintText>}
    </TextArea.Root>
  );
}

const meta: Meta<typeof StandardArea> = {
  title: "Components/Text Area",
  component: StandardArea,
  parameters: { layout: "padded" },
  argTypes: {
    size:  { control: "inline-radio", options: ["sm", "md", "lg"], table: { category: "Display" } },
    minRows: { control: { type: "number", min: 1, max: 20 }, table: { category: "Display" } },
    maxRows: { control: { type: "number", min: 1, max: 30 }, table: { category: "Display" } },
    label:        { table: { category: "Content" } },
    placeholder:  { table: { category: "Content" } },
    hint:         { table: { category: "Content" } },
    defaultValue: { table: { category: "Content" } },
    disabled:     { table: { category: "State" } },
    readOnly:     { table: { category: "State" } },
    required:     { table: { category: "State" } },
    error:        { table: { category: "State" } },
    success:      { table: { category: "State" } },
  },
  args: {
    label: "Label",
    placeholder: "Type a message…",
    size: "md",
    minRows: 4,
    maxRows: 8,
  },
};

export default meta;
type Story = StoryObj<typeof StandardArea>;

/* ────────────────────────────────────────────────────────────────
 * Core stories
 * ──────────────────────────────────────────────────────────── */

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Empty area. Auto-grows from `minRows=3` up to `maxRows=8`, then scrolls.",
      },
    },
  },
};

export const Active: Story = {
  parameters: { pseudo: { focusWithin: true } },
};

export const Filled: Story = {
  args: {
    defaultValue:
      "Got it! I'll review the proposal and circle back tomorrow morning with my feedback.",
  },
};

export const Error: Story = {
  args: { error: true, hint: "Message is required" },
};

export const Success: Story = {
  args: {
    success: true,
    defaultValue: "Thanks for the update — looks great!",
    hint: "Saved",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "This area is locked.",
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.",
  },
};

export const Required: Story = {
  args: { required: true, label: "Description" },
};

/* ────────────────────────────────────────────────────────────────
 * Rich content — user mentions + DDR references
 * ──────────────────────────────────────────────────────────── */

const RICH_HTML =
  'Hey <span data-badge="user">Alice</span> — when ' +
  '<span data-badge="ddr">{Workspace / Key Name}</span> is updated, please ' +
  'notify <span data-badge="user">Bob</span> and copy ' +
  '<span data-badge="ddr">{Action / Owner}</span>.';

export const RichContent: Story = {
  name: "Rich · badges (user + DDR)",
  args: { defaultValue: RICH_HTML, label: "Notes" },
  parameters: {
    docs: {
      description: {
        story:
          'HTML content with two badge types: `<span data-badge="user">…</span>` ' +
          '(pink) and `<span data-badge="ddr">…</span>` (blue). The picker ' +
          "dropdown for inserting badges is a future component.",
      },
    },
  },
};

export const RichContentError: Story = {
  name: "Rich · badges (error)",
  args: {
    defaultValue: RICH_HTML,
    error: true,
    hint: "Reference cannot be resolved.",
    label: "Notes",
  },
};

/* ────────────────────────────────────────────────────────────────
 * Auto-grow behaviour
 * ──────────────────────────────────────────────────────────── */

export const TallMaxRows: Story = {
  name: "Auto-grow · maxRows=12",
  args: {
    maxRows: 12,
    defaultValue:
      "Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10\nLine 11\nLine 12\nLine 13 (scrolls)\nLine 14",
    label: undefined,
  },
};

export const SmallMinRows: Story = {
  name: "Auto-grow · minRows=1",
  args: { minRows: 1, maxRows: 5, placeholder: "One-row default…", label: undefined },
};

/* ────────────────────────────────────────────────────────────────
 * Showcase — all states / sizes
 * ──────────────────────────────────────────────────────────── */

export const Showcase: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="space-y-8 bg-background p-8 font-sans">
      <Section title="Sizes">
        <StandardArea size="sm" placeholder="Small (text-caption)" label={undefined} />
        <StandardArea size="md" placeholder="Default (text-body)" label={undefined} />
        <StandardArea size="lg" placeholder="Large (text-larger-body)" label={undefined} />
      </Section>

      <Section title="States" cols={2}>
        <Labeled title="Default"><StandardArea label={undefined} placeholder="Default" /></Labeled>
        <Labeled title="Focus (force)"><StandardArea label={undefined} placeholder="Click to focus" /></Labeled>
        <Labeled title="Error">
          <StandardArea label={undefined} error defaultValue="Missing reference" hint="Reference cannot be resolved." />
        </Labeled>
        <Labeled title="Success">
          <StandardArea label={undefined} success defaultValue="Saved." hint="Saved" />
        </Labeled>
        <Labeled title="Disabled"><StandardArea label={undefined} disabled defaultValue="Locked" /></Labeled>
        <Labeled title="Read-only"><StandardArea label={undefined} readOnly defaultValue="Read-only content" /></Labeled>
      </Section>

      <Section title="Rich content · user + DDR badges">
        <StandardArea label="With badges" defaultValue={RICH_HTML} />
      </Section>
    </div>
  ),
};

function Section({
  title,
  children,
  cols = 1,
}: {
  title: string;
  children: React.ReactNode;
  cols?: 1 | 2;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-caption font-mono uppercase tracking-wide text-label-tertiary">
        {title}
      </h3>
      <div
        className={cols === 2 ? "grid grid-cols-2 gap-4 max-w-4xl" : "space-y-3 max-w-2xl"}
      >
        {children}
      </div>
    </section>
  );
}

function Labeled({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-tiny text-label-tertiary">{title}</div>
      {children}
    </div>
  );
}
