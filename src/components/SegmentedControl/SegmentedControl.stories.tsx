import type { Meta, StoryObj } from "@storybook/react";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { SegmentedControl } from "./SegmentedControl";

const meta: Meta<typeof SegmentedControl> = {
  title: "Components/Segmented Control",
  component: SegmentedControl,
  parameters: { layout: "padded" },
  argTypes: {
    layout: { control: "inline-radio", options: ["fill", "hug"], table: { category: "Display" } },
    disabled: { table: { category: "State" } },
    onValueChange: { action: "value", table: { category: "Events" } },
  },
};
export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  render: (args) => (
    <SegmentedControl {...args} defaultValue="since-start">
      <SegmentedControl.Item value="since-start">Since start</SegmentedControl.Item>
      <SegmentedControl.Item value="on-date">On date</SegmentedControl.Item>
      <SegmentedControl.Item value="from-field">From a field</SegmentedControl.Item>
    </SegmentedControl>
  ),
};

export const TwoOptions: Story = {
  render: () => (
    <SegmentedControl defaultValue="a">
      <SegmentedControl.Item value="a">Option A</SegmentedControl.Item>
      <SegmentedControl.Item value="b">Option B</SegmentedControl.Item>
    </SegmentedControl>
  ),
};

export const FourOptions: Story = {
  render: () => (
    <SegmentedControl defaultValue="2">
      <SegmentedControl.Item value="1">One</SegmentedControl.Item>
      <SegmentedControl.Item value="2">Two</SegmentedControl.Item>
      <SegmentedControl.Item value="3">Three</SegmentedControl.Item>
      <SegmentedControl.Item value="4">Four</SegmentedControl.Item>
    </SegmentedControl>
  ),
};

export const Hug: Story = {
  render: () => (
    <SegmentedControl layout="hug" defaultValue="b">
      <SegmentedControl.Item value="a">Short</SegmentedControl.Item>
      <SegmentedControl.Item value="b">Medium label</SegmentedControl.Item>
      <SegmentedControl.Item value="c">A longer one</SegmentedControl.Item>
    </SegmentedControl>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <SegmentedControl layout="hug" defaultValue="center">
      <SegmentedControl.Item value="left" icon={<AlignLeft size={16} />} aria-label="Left" />
      <SegmentedControl.Item value="center" icon={<AlignCenter size={16} />} aria-label="Center" />
      <SegmentedControl.Item value="right" icon={<AlignRight size={16} />} aria-label="Right" />
    </SegmentedControl>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <SegmentedControl {...args} defaultValue="b">
      <SegmentedControl.Item value="a">One</SegmentedControl.Item>
      <SegmentedControl.Item value="b">Two</SegmentedControl.Item>
      <SegmentedControl.Item value="c">Three</SegmentedControl.Item>
    </SegmentedControl>
  ),
};
