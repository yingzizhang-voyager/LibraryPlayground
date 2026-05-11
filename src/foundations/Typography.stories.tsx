import type { Meta, StoryObj } from "@storybook/react";
import { Page, Section } from "./_shared";

const meta: Meta = {
  title: "Foundations/Typography",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Type scale, families, and weights — sourced from local text styles " +
          "in Figma 'Hai Flow Web UI' (`awlKskuON6SMUJv0i4jhYs`).",
      },
    },
  },
};
export default meta;

interface TypeStyleRow {
  /** Tailwind utility class to render */
  cls: string;
  /** Figma style name */
  figma: string;
  /** Computed font-size (px) */
  size: number;
  /** Computed line-height (px or "auto") */
  line: number | "auto";
}

const SCALE: TypeStyleRow[] = [
  { cls: "text-hero",          figma: "32pt - Hero",          size: 32, line: "auto" },
  { cls: "text-large-title",   figma: "27pt - Large Title",   size: 27, line: 32 },
  { cls: "text-page-title",    figma: "24pt - Page title",    size: 24, line: 32 },
  { cls: "text-section-title", figma: "18pt - Section title", size: 18, line: 28 },
  { cls: "text-larger-body",   figma: "16pt - Larger body",   size: 16, line: 24 },
  { cls: "text-body",          figma: "14pt - Body",          size: 14, line: 20 },
  { cls: "text-caption",       figma: "12pt - Caption",       size: 12, line: 16 },
  { cls: "text-tiny",          figma: "11pt - Tiny",          size: 11, line: 16 },
  { cls: "text-chart",         figma: "10pt - Chart",         size: 10, line: 16 },
];

const SAMPLE = "The quick brown fox jumps over the lazy dog.";

function Row({ row, weight = "regular" }: { row: TypeStyleRow; weight?: "regular" | "light" }) {
  return (
    <div className="flex items-baseline gap-8 border-b border-border-tertiary py-4">
      <div className="w-48 shrink-0 space-y-1">
        <code className="block text-tiny font-mono text-label-primary">
          {row.cls}{weight === "light" ? " font-light" : ""}
        </code>
        <code className="block text-tiny font-mono text-label-tertiary">
          {row.size}px / {row.line === "auto" ? "auto" : `${row.line}px`}
        </code>
        <span className="block text-tiny text-label-quaternary">{row.figma}</span>
      </div>
      <div
        className={`${row.cls} text-label-primary ${weight === "light" ? "font-light" : "font-regular"}`}
      >
        {SAMPLE}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * 1. Type scale — Regular weight
 * ────────────────────────────────────────────────────────────── */
export const TypeScale: StoryObj = {
  name: "Type Scale · Regular",
  render: () => (
    <Page>
      <Section
        title="Type scale · GT America Regular"
        description="Nine steps from 10pt to 32pt. Each Tailwind utility (e.g. `text-body`) sets both font-size AND line-height."
      >
        <div className="space-y-0">
          {SCALE.map((r) => (
            <Row key={r.cls} row={r} />
          ))}
        </div>
      </Section>
    </Page>
  ),
};

/* ──────────────────────────────────────────────────────────────
 * 2. Light weight variant
 * ────────────────────────────────────────────────────────────── */
export const LightWeight: StoryObj = {
  name: "Type Scale · Light",
  render: () => (
    <Page>
      <Section
        title="Type scale · GT America Light"
        description="Add `font-light` to any size token to switch to the Light (300) weight."
      >
        <div className="space-y-0">
          {SCALE.map((r) => (
            <Row key={r.cls} row={r} weight="light" />
          ))}
        </div>
      </Section>
    </Page>
  ),
};

/* ──────────────────────────────────────────────────────────────
 * 3. Family showcase: sans / mono / uppercase
 * ────────────────────────────────────────────────────────────── */
export const FontFamilies: StoryObj = {
  name: "Families & Specials",
  render: () => (
    <Page>
      <Section
        title="Font families"
        description="Two families — sans (GT America) and mono (JetBrains Mono)."
      >
        <div className="space-y-0">
          <div className="flex items-baseline gap-8 border-b border-border-tertiary py-4">
            <div className="w-48 shrink-0">
              <code className="block text-tiny font-mono text-label-primary">font-sans</code>
              <span className="block text-tiny text-label-quaternary">GT America</span>
            </div>
            <div className="text-larger-body font-sans font-regular text-label-primary">{SAMPLE}</div>
          </div>
          <div className="flex items-baseline gap-8 border-b border-border-tertiary py-4">
            <div className="w-48 shrink-0">
              <code className="block text-tiny font-mono text-label-primary">font-mono</code>
              <span className="block text-tiny text-label-quaternary">JetBrains Mono</span>
            </div>
            <div className="text-larger-body font-mono text-label-primary">{SAMPLE}</div>
          </div>
        </div>
      </Section>

      <Section
        title="Specials"
        description="Combinations matching the named Figma text styles."
      >
        <div className="space-y-0">
          <div className="flex items-baseline gap-8 border-b border-border-tertiary py-4">
            <div className="w-48 shrink-0">
              <code className="block text-tiny font-mono text-label-primary">
                text-tiny uppercase
              </code>
              <span className="block text-tiny text-label-quaternary">
                11pt Tiny / Regular Uppercase
              </span>
            </div>
            <div className="text-tiny uppercase font-regular text-label-primary tracking-wide">
              {SAMPLE}
            </div>
          </div>
          <div className="flex items-baseline gap-8 border-b border-border-tertiary py-4">
            <div className="w-48 shrink-0">
              <code className="block text-tiny font-mono text-label-primary">
                text-body font-mono
              </code>
              <span className="block text-tiny text-label-quaternary">14pt Body / Mono</span>
            </div>
            <div className="text-body font-mono text-label-primary">{SAMPLE}</div>
          </div>
        </div>
      </Section>
    </Page>
  ),
};
