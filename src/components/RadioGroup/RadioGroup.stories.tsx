import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup } from "./RadioGroup";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/Radio Group",
  component: RadioGroup,
  parameters: { layout: "padded" },
  argTypes: {
    disabled: { table: { category: "State" } },
    onValueChange: { action: "value", table: { category: "Events" } },
  },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="specific-roles">
      <RadioGroup.Item value="only-assignees">Only assignees</RadioGroup.Item>
      <RadioGroup.Item value="everyone">Everyone</RadioGroup.Item>
      <RadioGroup.Item value="specific-roles">Specific roles</RadioGroup.Item>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <RadioGroup {...args} defaultValue="b">
      <RadioGroup.Item value="a">Option A</RadioGroup.Item>
      <RadioGroup.Item value="b">Option B</RadioGroup.Item>
    </RadioGroup>
  ),
};

export const Showcase: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="space-y-6 bg-background p-8 font-sans">
      <RadioGroup defaultValue="b">
        <RadioGroup.Item value="a">Option A</RadioGroup.Item>
        <RadioGroup.Item value="b">Option B (selected)</RadioGroup.Item>
        <RadioGroup.Item value="c" disabled>Option C (disabled)</RadioGroup.Item>
      </RadioGroup>
    </div>
  ),
};
