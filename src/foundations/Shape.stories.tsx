import type { Meta, StoryObj } from "@storybook/react";
import { Page, Section } from "./_shared";

const meta: Meta = {
  title: "Foundations/Shape",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Border radius scale (7 steps) and icon size scale (4 steps). " +
          "Source: Radius + Size collections in Figma 'Hai Flow Foundation'.",
      },
    },
  },
};
export default meta;

/* ── Radius ───────────────────────────────────────────────────── */

const RADII = [
  { cls: "rounded-none", token: "radius-none", px: 0 },
  { cls: "rounded-sm",   token: "radius-sm",   px: 4 },
  { cls: "rounded-md",   token: "radius-md",   px: 6 },
  { cls: "rounded-lg",   token: "radius-lg",   px: 8 },
  { cls: "rounded-xl",   token: "radius-xl",   px: 12 },
  { cls: "rounded-2xl",  token: "radius-2xl",  px: 16 },
  { cls: "rounded-full", token: "radius-full", px: 9999 },
];

export const Radius: StoryObj = {
  render: () => (
    <Page>
      <Section
        title="Border radius"
        description="Seven steps. `rounded-full` produces a pill / circle."
      >
        <div className="flex flex-wrap gap-8">
          {RADII.map((r) => (
            <div key={r.token} className="flex flex-col items-center gap-2">
              <div
                className={`${r.cls} h-24 w-24 bg-brand-card-background`}
                style={{ boxShadow: "inset 0 0 0 1px var(--color-brand-glacier)" }}
              />
              <div className="text-center">
                <code className="block text-tiny font-mono text-label-primary">{r.cls}</code>
                <code className="block text-tiny font-mono text-label-tertiary">
                  {r.px === 9999 ? "9999px (pill)" : `${r.px}px`}
                </code>
                <span className="block text-tiny text-label-quaternary">{r.token}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
};

/* ── Icon sizes ───────────────────────────────────────────────── */

const ICONS = [
  { token: "icon-xxs", px: 12, css: "var(--size-icon-xxs)" },
  { token: "icon-xs",  px: 16, css: "var(--size-icon-xs)"  },
  { token: "icon-md",  px: 20, css: "var(--size-icon-md)"  },
  { token: "icon-lg",  px: 24, css: "var(--size-icon-lg)"  },
];

export const IconSizes: StoryObj = {
  name: "Icon Sizes",
  render: () => (
    <Page>
      <Section
        title="Icon size scale"
        description="Four icon sizes. Pair with lucide-react `size={…}` or via CSS variable."
      >
        <div className="flex items-end gap-8">
          {ICONS.map((i) => (
            <div key={i.token} className="flex flex-col items-center gap-2">
              <div
                className="rounded-sm bg-foreground"
                style={{ width: i.css, height: i.css }}
              />
              <div className="text-center">
                <code className="block text-tiny font-mono text-label-primary">{i.token}</code>
                <code className="block text-tiny font-mono text-label-tertiary">{i.px}px</code>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  ),
};
