import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AtSign,
  DollarSign,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Search,
} from "lucide-react";
import { TextInput } from "./TextInput";

/**
 * Text Input — compound, single-line text field.
 *
 * Compose `TextInput.Root` with optional `Label`, the bordered `Field`
 * (containing 0–2 `Slot`s + `Input`), and optional `HintText`.
 *
 * Visual interaction states (hover / focus) are driven by `:hover` /
 * `:focus-within` so Storybook's pseudo-state addon can force them.
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
  leftIcon?: boolean;
  rightIcon?: boolean;
  leftPrefix?: string;
  rightSuffix?: string;
}

function StandardInput({
  label,
  placeholder = "Placeholder",
  hint,
  size = "md",
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  success = false,
  defaultValue,
  leftIcon,
  rightIcon,
  leftPrefix,
  rightSuffix,
}: ShowcaseArgs) {
  return (
    <TextInput.Root
      size={size}
      defaultValue={defaultValue}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      error={error}
      success={success}
    >
      {label && <TextInput.Label>{label}</TextInput.Label>}
      <TextInput.Field>
        {leftIcon && (
          <TextInput.Slot side="left">
            <Search size={16} strokeWidth={1.6} />
          </TextInput.Slot>
        )}
        {leftPrefix && <TextInput.Slot side="left">{leftPrefix}</TextInput.Slot>}
        <TextInput.Input placeholder={placeholder} />
        {rightIcon && (
          <TextInput.Slot side="right">
            <Mail size={16} strokeWidth={1.6} />
          </TextInput.Slot>
        )}
        {rightSuffix && <TextInput.Slot side="right">{rightSuffix}</TextInput.Slot>}
      </TextInput.Field>
      {hint && <TextInput.HintText>{hint}</TextInput.HintText>}
    </TextInput.Root>
  );
}

const meta: Meta<typeof StandardInput> = {
  title: "Components/Text Input",
  component: StandardInput,
  parameters: { layout: "padded" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"], table: { category: "Display" } },
    label:        { table: { category: "Content" } },
    placeholder:  { table: { category: "Content" } },
    hint:         { table: { category: "Content" } },
    defaultValue: { table: { category: "Content" } },
    leftPrefix:   { table: { category: "Slot" } },
    rightSuffix:  { table: { category: "Slot" } },
    leftIcon:     { table: { category: "Slot" } },
    rightIcon:    { table: { category: "Slot" } },
    disabled:     { table: { category: "State" } },
    readOnly:     { table: { category: "State" } },
    required:     { table: { category: "State" } },
    error:        { table: { category: "State" } },
    success:      { table: { category: "State" } },
  },
  args: {
    label: "Label",
    placeholder: "Placeholder",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof StandardInput>;

/* ────────────────────────────────────────────────────────────────
 * Core stories
 * ──────────────────────────────────────────────────────────── */

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Baseline medium input. Use Controls to flip state / slots.",
      },
    },
  },
};

export const Active: Story = {
  parameters: { pseudo: { focusWithin: true } },
};

export const Filled: Story = {
  args: { defaultValue: "Acme Corp" },
};

export const Error: Story = {
  args: { error: true, defaultValue: "invalid@", hint: "Email is invalid" },
};

export const Success: Story = {
  args: { success: true, defaultValue: "valid@example.com", hint: "Looks good" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Disabled" },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: "Read-only value" },
};

export const Required: Story = {
  args: { required: true, label: "Email", placeholder: "you@example.com" },
  parameters: {
    docs: {
      description: {
        story:
          "`required` puts a red `*` after the Label and applies `required` / `aria-required` to the underlying input.",
      },
    },
  },
};

/* ────────────────────────────────────────────────────────────────
 * Slot patterns (icons + prefix/suffix text)
 * ──────────────────────────────────────────────────────────── */

export const WithLeftIcon: Story = {
  name: "Slot · Left icon",
  args: { leftIcon: true, placeholder: "Search…", label: undefined },
};

export const WithRightIcon: Story = {
  name: "Slot · Right icon",
  args: { rightIcon: true, placeholder: "you@example.com", label: undefined },
};

export const CurrencyPattern: Story = {
  name: "Slot · Currency ($ … USD)",
  args: {
    leftPrefix: "$",
    rightSuffix: "USD",
    placeholder: "0.00",
    label: undefined,
  },
};

export const SubdomainPattern: Story = {
  name: "Slot · Subdomain (https:// … .moxo.com)",
  args: {
    leftPrefix: "https://",
    rightSuffix: ".moxo.com",
    placeholder: "subdomain",
    label: undefined,
  },
};

export const EmailPattern: Story = {
  name: "Slot · Email (@ icon)",
  parameters: { docs: { description: { story: "AtSign icon as left slot, no label." } } },
  render: () => (
    <TextInput.Root>
      <TextInput.Field>
        <TextInput.Slot side="left"><AtSign size={16} strokeWidth={1.6} /></TextInput.Slot>
        <TextInput.Input type="email" placeholder="you@example.com" />
      </TextInput.Field>
    </TextInput.Root>
  ),
};

/* ────────────────────────────────────────────────────────────────
 * Loading & Password — compose with interactive children
 * ──────────────────────────────────────────────────────────── */

export const Loading: Story = {
  name: "Slot · Loading spinner",
  parameters: {
    docs: {
      description: {
        story:
          "Compose a spinner into the right slot. The wrapper is read-only / non-interactive.",
      },
    },
  },
  render: () => (
    <TextInput.Root readOnly defaultValue="Validating…">
      <TextInput.Field>
        <TextInput.Input />
        <TextInput.Slot side="right">
          <Loader2 size={16} strokeWidth={1.6} className="animate-spin" />
        </TextInput.Slot>
      </TextInput.Field>
    </TextInput.Root>
  ),
};

export const PasswordToggle: Story = {
  name: "Slot · Password show/hide",
  parameters: {
    docs: {
      description: {
        story:
          "Interactive `<button>` inside the right slot. Override the slot's `pointer-events-none` to keep the toggle clickable.",
      },
    },
  },
  render: () => {
    function PasswordField() {
      const [shown, setShown] = useState(false);
      return (
        <TextInput.Root defaultValue="hunter2">
          <TextInput.Field>
            <TextInput.Input type={shown ? "text" : "password"} placeholder="••••••••" />
            <TextInput.Slot side="right" className="pointer-events-auto">
              <button
                type="button"
                onClick={() => setShown((v) => !v)}
                aria-label={shown ? "Hide password" : "Show password"}
                className="rounded-sm p-0.5 text-fill-primary hover:bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-glacier"
              >
                {shown ? <EyeOff size={16} strokeWidth={1.6} /> : <Eye size={16} strokeWidth={1.6} />}
              </button>
            </TextInput.Slot>
          </TextInput.Field>
        </TextInput.Root>
      );
    }
    return <PasswordField />;
  },
};

/* ────────────────────────────────────────────────────────────────
 * Showcase — all states/sizes/slots in one canvas
 * ──────────────────────────────────────────────────────────── */

export const Showcase: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="space-y-8 bg-background p-8 font-sans">
      <Section title="Sizes">
        <StandardInput size="sm" placeholder="Small (28px)" label={undefined} />
        <StandardInput size="md" placeholder="Default (36px)" label={undefined} />
        <StandardInput size="lg" placeholder="Large (44px)" label={undefined} />
      </Section>

      <Section title="States" cols={3}>
        <Labeled title="Default"><StandardInput placeholder="Default" label={undefined} /></Labeled>
        <Labeled title="Hover (force)"><StandardInput placeholder="Hover me" label={undefined} /></Labeled>
        <Labeled title="Focus (force)"><StandardInput placeholder="Click to focus" label={undefined} /></Labeled>
        <Labeled title="Error"><StandardInput error defaultValue="invalid@" label={undefined} /></Labeled>
        <Labeled title="Success"><StandardInput success defaultValue="valid@example.com" label={undefined} /></Labeled>
        <Labeled title="Loading">
          <TextInput.Root readOnly defaultValue="Validating…">
            <TextInput.Field>
              <TextInput.Input />
              <TextInput.Slot side="right">
                <Loader2 size={16} strokeWidth={1.6} className="animate-spin" />
              </TextInput.Slot>
            </TextInput.Field>
          </TextInput.Root>
        </Labeled>
        <Labeled title="Disabled"><StandardInput disabled defaultValue="Disabled" label={undefined} /></Labeled>
        <Labeled title="Read-only"><StandardInput readOnly defaultValue="Read-only" label={undefined} /></Labeled>
        <Labeled title="With icon">
          <TextInput.Root>
            <TextInput.Field>
              <TextInput.Slot side="left"><Search size={16} strokeWidth={1.6} /></TextInput.Slot>
              <TextInput.Input placeholder="Search…" />
            </TextInput.Field>
          </TextInput.Root>
        </Labeled>
      </Section>

      <Section title="Slot patterns">
        <TextInput.Root>
          <TextInput.Field>
            <TextInput.Slot side="left"><DollarSign size={16} strokeWidth={1.6} /></TextInput.Slot>
            <TextInput.Input placeholder="0.00" />
            <TextInput.Slot side="right">USD</TextInput.Slot>
          </TextInput.Field>
        </TextInput.Root>

        <TextInput.Root>
          <TextInput.Field>
            <TextInput.Slot side="left">https://</TextInput.Slot>
            <TextInput.Input placeholder="subdomain" />
            <TextInput.Slot side="right">.moxo.com</TextInput.Slot>
          </TextInput.Field>
        </TextInput.Root>

        <TextInput.Root>
          <TextInput.Field>
            <TextInput.Slot side="left"><AtSign size={16} strokeWidth={1.6} /></TextInput.Slot>
            <TextInput.Input type="email" placeholder="you@example.com" />
          </TextInput.Field>
        </TextInput.Root>
      </Section>

      <Section title="Composed with label + hint">
        <TextInput.Root>
          <TextInput.Label>Flow name</TextInput.Label>
          <TextInput.Field>
            <TextInput.Input placeholder="Enter a name for this flow…" />
          </TextInput.Field>
          <TextInput.HintText>This name will be visible to assignees.</TextInput.HintText>
        </TextInput.Root>
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
  cols?: 1 | 3;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-caption font-mono uppercase tracking-wide text-label-tertiary">
        {title}
      </h3>
      <div
        className={cols === 3 ? "grid grid-cols-3 gap-4 max-w-3xl" : "space-y-2 max-w-md"}
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
