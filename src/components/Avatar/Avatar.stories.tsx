import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  argTypes: {
    type:     { control: "inline-radio", options: ["Initial", "Image"], table: { category: "Display" } },
    size:     { control: "inline-radio", options: [16, 24, 32],         table: { category: "Display" } },
    initials: { control: "text",  table: { category: "Content" } },
    color:    { control: "color", table: { category: "Display" } },
    src:      { control: "text",  table: { category: "Content" } },
    alt:      { control: "text",  table: { category: "Content" } },
  },
  args: { type: "Initial", initials: "H", size: 32 },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

/* ── Figma variants ─────────────────────────────────────────── */

/* Type=Initial */
export const InitialSize16: Story = { args: { type: "Initial", size: 16, initials: "H" } };
export const InitialSize24: Story = { args: { type: "Initial", size: 24, initials: "H" } };
export const InitialSize32: Story = { args: { type: "Initial", size: 32, initials: "H" } };

/* Type=Image */
export const ImageSize16: Story = {
  args: { type: "Image", size: 16, src: "https://i.pravatar.cc/32?img=5", alt: "User" },
};
export const ImageSize24: Story = {
  args: { type: "Image", size: 24, src: "https://i.pravatar.cc/48?img=5", alt: "User" },
};
export const ImageSize32: Story = {
  args: { type: "Image", size: 32, src: "https://i.pravatar.cc/64?img=5", alt: "User" },
};

/* ── Extras ──────────────────────────────────────────────────── */
export const MultiInitials: Story = { args: { type: "Initial", size: 32, initials: "AF" } };

export const CustomColor: Story = {
  args: { type: "Initial", size: 32, initials: "RM", color: "var(--color-jade-700)" },
};

/* ── Showcase ────────────────────────────────────────────────── */
export const Showcase: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-6 bg-background p-8 font-sans">
      <Section title="Initial — sizes">
        <Avatar type="Initial" size={16} initials="H" />
        <Avatar type="Initial" size={24} initials="H" />
        <Avatar type="Initial" size={32} initials="H" />
      </Section>

      <Section title="Initial — multi-char initials">
        <Avatar type="Initial" size={16} initials="AF" />
        <Avatar type="Initial" size={24} initials="AF" />
        <Avatar type="Initial" size={32} initials="AF" />
      </Section>

      <Section title="Initial — custom colors">
        <Avatar type="Initial" size={32} initials="C"  color="var(--color-butter-500)"    />
        <Avatar type="Initial" size={32} initials="RM" color="var(--color-jade-700)"      />
        <Avatar type="Initial" size={32} initials="IS" color="var(--color-shell-600)"     />
        <Avatar type="Initial" size={32} initials="A"  color="var(--color-brand-glacier)" />
        <Avatar type="Initial" size={32} initials="B"  color="var(--color-quartz-500)"    />
      </Section>

      <Section title="Image — sizes">
        <Avatar type="Image" size={16} src="https://i.pravatar.cc/32?img=5" alt="User" />
        <Avatar type="Image" size={24} src="https://i.pravatar.cc/48?img=5" alt="User" />
        <Avatar type="Image" size={32} src="https://i.pravatar.cc/64?img=5" alt="User" />
      </Section>
    </div>
  ),
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="font-mono text-caption uppercase tracking-wide text-label-tertiary">
        {title}
      </h3>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}
