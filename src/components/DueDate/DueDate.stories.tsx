import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DueDate, DUE_DATE_DEFAULT, type DueDateValue } from "./DueDate";

const meta: Meta<typeof DueDate> = {
  title: "Components/DueDate",
  component: DueDate,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div style={{ width: 500 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof DueDate>;

function Controlled({ initial }: { initial: DueDateValue }) {
  const [value, setValue] = useState<DueDateValue>(initial);
  return <DueDate value={value} onValueChange={setValue} />;
}

export const None: Story = {
  render: () => <Controlled initial={DUE_DATE_DEFAULT} />,
};

export const SinceStart: Story = {
  render: () => (
    <Controlled
      initial={{
        ...DUE_DATE_DEFAULT,
        enabled: true,
        mode: "since-start",
      }}
    />
  ),
};

export const OnDate: Story = {
  render: () => (
    <Controlled
      initial={{
        ...DUE_DATE_DEFAULT,
        enabled: true,
        mode: "on-date",
      }}
    />
  ),
};

export const FromField: Story = {
  render: () => (
    <Controlled
      initial={{
        ...DUE_DATE_DEFAULT,
        enabled: true,
        mode: "from-field",
        direction: "before",
      }}
    />
  ),
};

export const HideExcludeWeekends: Story = {
  render: () => {
    const [value, setValue] = useState<DueDateValue>({
      ...DUE_DATE_DEFAULT,
      enabled: true,
      mode: "since-start",
    });
    return <DueDate value={value} onValueChange={setValue} hideExcludeWeekends />;
  },
};
