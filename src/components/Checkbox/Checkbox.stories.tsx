import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: { layout: "padded" },
  argTypes: {
    checked: { control: "select", options: [false, true, "indeterminate"], table: { category: "State" } },
    disabled: { table: { category: "State" } },
    onCheckedChange: { action: "checked", table: { category: "Events" } },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { defaultChecked: "indeterminate" } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } };

export const WithLabel: Story = {
  render: () => (
    <label className="inline-flex items-center gap-2 text-body text-foreground">
      <Checkbox />
      Exclude weekends
    </label>
  ),
};

export const Showcase: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="space-y-6 bg-background p-8 font-sans">
      <div className="flex items-center gap-4">
        <Checkbox />
        <Checkbox defaultChecked />
        <Checkbox defaultChecked="indeterminate" />
        <Checkbox disabled />
        <Checkbox disabled defaultChecked />
      </div>
    </div>
  ),
};
