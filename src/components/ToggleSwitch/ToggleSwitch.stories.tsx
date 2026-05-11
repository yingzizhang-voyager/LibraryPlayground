import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ToggleSwitch } from "./ToggleSwitch";

const meta: Meta<typeof ToggleSwitch> = {
  title: "Components/Toggle Switch",
  component: ToggleSwitch,
  parameters: { layout: "padded" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md"], table: { category: "Display" } },
    checked: { control: "boolean", table: { category: "State" } },
    disabled: { table: { category: "State" } },
    onCheckedChange: { action: "checked", table: { category: "Events" } },
  },
  args: { size: "md" },
};
export default meta;
type Story = StoryObj<typeof ToggleSwitch>;

export const Off: Story = {};
export const On: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledOn: Story = { args: { disabled: true, defaultChecked: true } };
export const Small: Story = { args: { size: "sm" } };
export const SmallOn: Story = { args: { size: "sm", defaultChecked: true } };

export const Interactive: Story = {
  render: () => {
    function Demo() {
      const [v, setV] = useState(false);
      return (
        <label className="inline-flex items-center gap-2 text-body text-foreground">
          <ToggleSwitch checked={v} onCheckedChange={setV} />
          Sequential order ({v ? "on" : "off"})
        </label>
      );
    }
    return <Demo />;
  },
};

export const Showcase: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="space-y-6 bg-background p-8 font-sans">
      <Row title="Medium (md)">
        <ToggleSwitch />
        <ToggleSwitch defaultChecked />
        <ToggleSwitch disabled />
        <ToggleSwitch disabled defaultChecked />
      </Row>
      <Row title="Small (sm)">
        <ToggleSwitch size="sm" />
        <ToggleSwitch size="sm" defaultChecked />
        <ToggleSwitch size="sm" disabled />
        <ToggleSwitch size="sm" disabled defaultChecked />
      </Row>
    </div>
  ),
};

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-caption font-mono uppercase tracking-wide text-label-tertiary">{title}</h3>
      <div className="flex items-center gap-4">{children}</div>
    </section>
  );
}
