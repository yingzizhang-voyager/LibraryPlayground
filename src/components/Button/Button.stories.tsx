import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDown, Plus, Sparkles, Trash2, X } from "lucide-react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "filled", "ghost", "link", "destructive", "success"],
      table: { category: "Display" },
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"], table: { category: "Display" } },
    loading: { table: { category: "State" } },
    disabled: { table: { category: "State" } },
    children: { control: "text", table: { category: "Content" } },
    onClick: { action: "click", table: { category: "Events" } },
  },
  args: { children: "Label", variant: "default", size: "md" },
};
export default meta;
type Story = StoryObj<typeof Button>;

/* Core variants */
export const Default: Story = {};
export const Outline: Story = { args: { variant: "outline" } };
export const Filled: Story = { args: { variant: "filled" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Link: Story = { args: { variant: "link" } };
export const Destructive: Story = { args: { variant: "destructive" } };
export const Success: Story = { args: { variant: "success" } };

/* Sizes */
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };

/* States */
export const Hover: Story = { parameters: { pseudo: { hover: true } } };
export const Active: Story = { parameters: { pseudo: { active: true } } };
export const Focused: Story = { parameters: { pseudo: { focusVisible: true } } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };

/* With icons */
export const LeftIcon: Story = {
  args: {
    leftIcon: <Sparkles size={16} strokeWidth={1.6} />,
    children: "Enhance with AI",
    variant: "outline",
  },
};
export const RightIcon: Story = {
  args: { rightIcon: <ChevronDown size={16} strokeWidth={1.6} />, children: "More" },
};

/* Icon-only square button — override padding via className */
export const IconOnly: Story = {
  args: {
    variant: "ghost",
    className: "px-0 w-8",
    "aria-label": "Close",
    children: <X size={16} strokeWidth={1.6} />,
  },
};

/* Showcase */
export const Showcase: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="space-y-8 bg-background p-8 font-sans">
      <Section title="Variants (md)">
        <Button>Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="filled">Filled</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="success">Success</Button>
      </Section>

      <Section title="Sizes (Default variant)">
        <Button size="sm">Small</Button>
        <Button size="md">Default</Button>
        <Button size="lg">Large</Button>
      </Section>

      <Section title="States">
        <Labeled title="Resting"><Button>Resting</Button></Labeled>
        <Labeled title="Disabled"><Button disabled>Disabled</Button></Labeled>
        <Labeled title="Loading"><Button loading>Loading</Button></Labeled>
      </Section>

      <Section title="With icons">
        <Button leftIcon={<Sparkles size={16} strokeWidth={1.6} />} variant="outline">
          Enhance with AI
        </Button>
        <Button rightIcon={<ChevronDown size={16} strokeWidth={1.6} />}>
          Dropdown
        </Button>
        <Button leftIcon={<Trash2 size={16} strokeWidth={1.6} />} variant="destructive">
          Delete
        </Button>
        <Button
          leftIcon={<Plus size={14} strokeWidth={1.6} />}
          variant="ghost"
          size="sm"
          className="text-brand-action"
        >
          Add variable
        </Button>
      </Section>

      <Section title="Icon-only (square via className)">
        <Button variant="ghost" className="px-0 w-8" aria-label="Close">
          <X size={16} strokeWidth={1.6} />
        </Button>
        <Button variant="ghost" size="sm" className="px-0 w-6" aria-label="More">
          <ChevronDown size={14} strokeWidth={1.6} />
        </Button>
      </Section>

      <Section title="Full width (modal footer)">
        <Button size="lg" className="w-full">Next</Button>
      </Section>
    </div>
  ),
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-caption font-mono uppercase tracking-wide text-label-tertiary">
        {title}
      </h3>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
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
