import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { RichTextEditor } from "./RichTextEditor";

/**
 * Rich Text Editor — compound component.
 *
 * Variants are explored two ways:
 *   • Toggle `disabled` / `error` / `defaultValue` / `hint` via the **Controls** panel
 *   • Force `:hover` and `:focus-within` via Storybook's **pseudo-state addon** toolbar
 *     (top of the canvas → 🎨 icon)
 *
 * `Gallery` shows every Figma variant side-by-side; `Custom` shows compound flexibility.
 */

/* ── A composed "standard" editor used by every story ──────────── */
function StandardEditor({
  label = "Label",
  placeholder = "Placeholder",
  hint,
  defaultValue,
  disabled = false,
  error = false,
}: {
  label?: string;
  placeholder?: string;
  hint?: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: boolean;
}) {
  return (
    <RichTextEditor.Root
      defaultValue={defaultValue}
      disabled={disabled}
      error={error}
    >
      <RichTextEditor.Label>{label}</RichTextEditor.Label>
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
        <RichTextEditor.Input placeholder={placeholder} />
      </RichTextEditor.Field>
      {hint && <RichTextEditor.HintText>{hint}</RichTextEditor.HintText>}
    </RichTextEditor.Root>
  );
}

const meta: Meta<typeof StandardEditor> = {
  title: "Components/Rich Text Editor",
  component: StandardEditor,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Compound component. Compose `RichTextEditor.Root` with `Label`, `Field` " +
          "(containing `Toolbar` + `Input`), and `HintText`.",
      },
    },
  },
  argTypes: {
    label:        { table: { category: "Content" } },
    placeholder:  { table: { category: "Content" } },
    hint:         { table: { category: "Content" } },
    defaultValue: { table: { category: "Content" } },
    disabled:     { table: { category: "State" } },
    error:        { table: { category: "State" } },
  },
};

export default meta;
type Story = StoryObj<typeof StandardEditor>;

const RICH_HTML =
  'Hello, <span data-chip="true">{Workspace / Key Name}</span> is completed. ' +
  "thanks for choosing to work with us. If you have any questions, please feel free to";
const RICH_HTML_FILLED = 'Hello, <span data-chip="true">{ ... }</span> is completed.';
const ERROR_MSG = "A short sentence case message";

/* ────────────────────────────────────────────────────────────────
 * Core stories — five canonical states. Use Controls / pseudo
 * addon to explore other combinations.
 * ──────────────────────────────────────────────────────────── */

export const Default: Story = {
  parameters: {
    figmaNode: "180:113345",
    docs: {
      description: {
        story:
          "Baseline editor — empty, resting. Use Controls to toggle `error` / `disabled` / set content; " +
          "use the pseudo addon to force `:hover` or `:focus-within`.",
      },
    },
  },
};

export const Filled: Story = {
  args: { defaultValue: RICH_HTML },
  parameters: { figmaNode: "180:113524" },
};

export const Error: Story = {
  args: { error: true, hint: ERROR_MSG },
  parameters: { figmaNode: "180:113367" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Aa" },
  parameters: { figmaNode: "180:113574" },
};

export const Active: Story = {
  parameters: {
    figmaNode: "180:113422",
    pseudo: { focusWithin: true },
    docs: {
      description: {
        story: "Focused (active) state. Locked via `parameters.pseudo.focusWithin`.",
      },
    },
  },
};

/* ────────────────────────────────────────────────────────────────
 * Gallery — all 22 Figma variants side-by-side
 * ──────────────────────────────────────────────────────────── */

const GALLERY: Array<{ title: string; el: ReactNode }> = [
  { title: "1. Default · Empty",                el: <StandardEditor /> },
  { title: "2. Default · Empty (hover)",        el: <StandardEditor /> },
  { title: "3. Default · Rich",                 el: <StandardEditor defaultValue={RICH_HTML} /> },
  { title: "4. Default · Rich (hover)",         el: <StandardEditor defaultValue={RICH_HTML} /> },
  { title: "5. Error · Empty",                  el: <StandardEditor error hint={ERROR_MSG} /> },
  { title: "6. Error · Rich",                   el: <StandardEditor error hint={ERROR_MSG} defaultValue={RICH_HTML} /> },
  { title: "7. Disabled · Empty",               el: <StandardEditor disabled /> },
  { title: "8. Disabled · Rich (empty)",        el: <StandardEditor disabled /> },
  { title: "9. Disabled · Filled rich",         el: <StandardEditor disabled defaultValue={RICH_HTML_FILLED} /> },
  { title: "10. Active · Empty",                el: <StandardEditor /> },
  { title: "11. Active · Empty (rich axis)",    el: <StandardEditor /> },
  { title: "12. Active · Empty + Error",        el: <StandardEditor error hint={ERROR_MSG} /> },
  { title: "13. Active · Empty rich + Error",   el: <StandardEditor error hint={ERROR_MSG} /> },
  { title: "14. Active · Filled",               el: <StandardEditor defaultValue="Aa" /> },
  { title: "15. Active · Filled rich",          el: <StandardEditor defaultValue={RICH_HTML} /> },
  { title: "16. Active · Filled + Error",       el: <StandardEditor defaultValue="Aa" error hint={ERROR_MSG} /> },
  { title: "17. Filled",                        el: <StandardEditor defaultValue="Aa" /> },
  { title: "18. Filled · Rich",                 el: <StandardEditor defaultValue={RICH_HTML} /> },
  { title: "19. Filled · Error",                el: <StandardEditor defaultValue="Aa" error hint={ERROR_MSG} /> },
  { title: "20. Filled · Rich + Error",         el: <StandardEditor defaultValue={RICH_HTML} error hint={ERROR_MSG} /> },
  { title: "21. Active · Filled rich + Error",  el: <StandardEditor defaultValue={RICH_HTML_FILLED} error hint={ERROR_MSG} /> },
  { title: "22. Disabled · Filled",             el: <StandardEditor disabled defaultValue="Aa" /> },
];

export const Gallery: Story = {
  name: "Gallery · All 22 variants",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "All 22 Figma variants rendered in one view. Use this as the canonical visual reference " +
          "against COMPONENT_SET `180:113344`.",
      },
    },
  },
  render: () => (
    <div className="bg-background p-8">
      <div className="grid grid-cols-2 gap-8" style={{ maxWidth: 880 }}>
        {GALLERY.map((variant) => (
          <div key={variant.title} className="space-y-2">
            <div className="text-tiny text-label-tertiary">{variant.title}</div>
            {variant.el}
          </div>
        ))}
      </div>
    </div>
  ),
};

/* ────────────────────────────────────────────────────────────────
 * Custom composition — demonstrates compound flexibility
 * ──────────────────────────────────────────────────────────── */

export const Custom: Story = {
  name: "Custom · No toolbar",
  parameters: {
    docs: {
      description: {
        story: "Just `Root` + `Label` + `Field` + `Input` (no toolbar) + a hint.",
      },
    },
  },
  render: () => (
    <RichTextEditor.Root>
      <RichTextEditor.Label>Notes</RichTextEditor.Label>
      <RichTextEditor.Field>
        <RichTextEditor.Input placeholder="Free-form notes…" />
      </RichTextEditor.Field>
      <RichTextEditor.HintText>Plain text only.</RichTextEditor.HintText>
    </RichTextEditor.Root>
  ),
};
