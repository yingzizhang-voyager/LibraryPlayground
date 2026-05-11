import type { Meta, StoryObj } from "@storybook/react";
import { Group, Page, Section, Swatch } from "./_shared";

const meta: Meta = {
  title: "Foundations/Colors",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Colour tokens sourced from Figma 'Hai Flow Foundation' " +
          "(file `WB9fm7ir5f8Lyaim0iEMll`). All values are 1:1 with the Figma " +
          "variable names and resolved by `figma.variables.getLocalVariables()`.",
      },
    },
  },
};
export default meta;

/* ─── Helpers ────────────────────────────────────────────────── */

/** Build a swatch row from a list of step numbers and a base name. */
function scaleSwatches(prefix: string, steps: Array<number | string>) {
  return steps.map((step) => (
    <Swatch
      key={`${prefix}-${step}`}
      name={`${prefix}-${step}`}
      color={`var(--color-${prefix}-${step})`}
      outlined
    />
  ));
}

/* ──────────────────────────────────────────────────────────────
 * 1. Primitives
 *    Raw colour values. 96 tokens across 11 scales.
 * ────────────────────────────────────────────────────────────── */
export const Primitives: StoryObj = {
  render: () => (
    <Page>
      <Section
        title="Primitives"
        description="Raw colour values, the lowest layer of the design system. Reference these only when no semantic token fits."
      >
        <Group title="Greys · Basalt">
          <Swatch name="white" color="var(--color-white)" outlined />
          {scaleSwatches("basalt", [100, 200, 300, 400, 500, 600, 700, 800])}
        </Group>

        <Group title="Greys · Basalt-tint (translucent overlays)">
          {scaleSwatches("basalt-tint", [30, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900])}
        </Group>

        <Group title="Off-whites · Travertine">
          {scaleSwatches("travertine", [100, 200, 250, 300, 400, 500, 600, 700, 800, 900])}
        </Group>

        <Group title="Off-whites · Travertine-tint">
          {scaleSwatches("travertine-tint", [100, 200, 300, 400, 500, 600, 700, 800, 900])}
        </Group>

        <Group title="Reds · Shell (error family)">
          {scaleSwatches("shell", [100, 200, 300, 400, 500, 600, 700, 800, 900])}
        </Group>

        <Group title="Greens · Jade (success family)">
          {scaleSwatches("jade", [100, 150, 200, 300, 400, 500, 600, 700, 800, 900])}
        </Group>

        <Group title="Yellows · Butter (warning family)">
          {scaleSwatches("butter", [50, 100, 200, 300, 400, 500, 600, 700, 900])}
        </Group>

        <Group title="Blues · Glacier (brand family)">
          {scaleSwatches("glacier", [50, 100, 200, 300, 400, 500, 600, 700, 800, 900])}
        </Group>

        <Group title="Cyans · Aquamarine (accent)">
          {scaleSwatches("aquamarine", [100, 200, 300, 400, 500, 550, 600, 700])}
        </Group>

        <Group title="Pinks · Quartz (accent)">
          {scaleSwatches("quartz", [100, 200, 300, 400, 500, 600])}
        </Group>

        <Group title="Role (sequence)">
          {scaleSwatches("role", [1, 2, 3, 4, 5])}
        </Group>
      </Section>
    </Page>
  ),
};

/* ──────────────────────────────────────────────────────────────
 * 2. Semantic
 *    Surfaces, labels, fills, borders, status, brand, interaction.
 * ────────────────────────────────────────────────────────────── */
export const Semantic: StoryObj = {
  render: () => (
    <Page>
      <Section
        title="Semantic"
        description="High-level intent tokens. Use these in components — they automatically follow theme changes."
      >
        <Group title="Surfaces">
          {[
            "background",
            "white-background",
            "foreground",
            "card",
            "card-foreground",
            "popover",
            "popover-foreground",
            "muted",
            "muted-foreground",
            "primary",
            "primary-foreground",
            "secondary",
            "secondary-foreground",
            "accent",
            "accent-foreground",
            "input",
          ].map((n) => (
            <Swatch key={n} name={n} color={`var(--color-${n})`} outlined />
          ))}
        </Group>

        <Group title="Label (text)">
          {["strongest", "heading", "heavy", "primary", "secondary", "tertiary", "quaternary"].map(
            (n) => (
              <Swatch
                key={n}
                name={`label-${n}`}
                color={`var(--color-label-${n})`}
                outlined
              />
            ),
          )}
        </Group>

        <Group title="Fill (icons & non-text)">
          {["primary", "secondary", "tertiary", "quaternary"].map((n) => (
            <Swatch
              key={n}
              name={`fill-${n}`}
              color={`var(--color-fill-${n})`}
              outlined
            />
          ))}
        </Group>

        <Group title="Border">
          {["primary", "secondary", "tertiary", "transparent"].map((n) => (
            <Swatch
              key={n}
              name={`border-${n}`}
              color={`var(--color-border-${n})`}
              outlined
            />
          ))}
        </Group>

        <Group title="Status · Success">
          {["success", "success-label", "success-bg", "success-ring"].map((n) => (
            <Swatch key={n} name={n} color={`var(--color-${n})`} outlined />
          ))}
        </Group>

        <Group title="Status · Warning">
          {["warning", "warning-label", "warning-bg", "warning-ring"].map((n) => (
            <Swatch key={n} name={n} color={`var(--color-${n})`} outlined />
          ))}
        </Group>

        <Group title="Status · Error">
          {["error", "error-label", "error-bg", "error-ring"].map((n) => (
            <Swatch key={n} name={n} color={`var(--color-${n})`} outlined />
          ))}
        </Group>

        <Group title="Accent · Aquamarine">
          {[
            "accent-aquamarine",
            "accent-aquamarine-label",
            "accent-aquamarine-bg",
            "accent-aquamarine-border",
          ].map((n) => (
            <Swatch key={n} name={n} color={`var(--color-${n})`} outlined />
          ))}
        </Group>

        <Group title="Accent · Quartz">
          {[
            "accent-quartz",
            "accent-quartz-label",
            "accent-quartz-bg",
            "accent-quartz-border",
          ].map((n) => (
            <Swatch key={n} name={n} color={`var(--color-${n})`} outlined />
          ))}
        </Group>

        <Group title="Brand">
          {[
            "brand-glacier",
            "brand-action",
            "brand-action-disabled",
            "brand-background",
            "brand-card-background",
            "brand-surface",
            "brand-border",
            "button-primary",
            "button-primary-foreground",
          ].map((n) => (
            <Swatch key={n} name={n} color={`var(--color-${n})`} outlined />
          ))}
        </Group>

        <Group title="Interaction overlays">
          {[
            "hover",
            "hover-lightweight",
            "hover-dark",
            "press",
            "press-dark",
            "scrim",
            "ring",
          ].map((n) => (
            <Swatch key={n} name={n} color={`var(--color-${n})`} outlined />
          ))}
        </Group>
      </Section>
    </Page>
  ),
};

/* ──────────────────────────────────────────────────────────────
 * 3. Workflow / Action colours
 *    14 action types × {main, label, bg, tint}
 * ────────────────────────────────────────────────────────────── */

const ACTIONS = [
  "acknowledgement",
  "approval",
  "todo",
  "file-request",
  "esign",
  "form",
  "pdf-form",
  "decision",
  "questionnaire",
  "launch-web-app",
  "time-booking",
  "generic",
  "automation",
] as const;

export const WorkflowActions: StoryObj = {
  name: "Workflow Actions",
  render: () => (
    <Page>
      <Section
        title="Workflow / Action colours"
        description="Per-action colour family. Each action exposes a base, label, bg, and tint variant. Source: Flow Colors collection (Light mode)."
      >
        {ACTIONS.map((action) => (
          <Group key={action} title={action}>
            {(["", "-label", "-bg", "-tint"] as const).map((suffix) => (
              <Swatch
                key={`${action}${suffix}`}
                name={`flow-${action}${suffix}`}
                color={`var(--color-flow-${action}${suffix})`}
                outlined
              />
            ))}
          </Group>
        ))}

        <Group title="Flow specials">
          {["flow-connector", "flow-milestone"].map((n) => (
            <Swatch key={n} name={n} color={`var(--color-${n})`} outlined />
          ))}
        </Group>
      </Section>
    </Page>
  ),
};

/* ──────────────────────────────────────────────────────────────
 * 4. Chart + Role palettes
 * ────────────────────────────────────────────────────────────── */
export const ChartAndRole: StoryObj = {
  name: "Chart & Role",
  render: () => (
    <Page>
      <Section
        title="Chart palette"
        description="Categorical 8-step palette tuned for data visualisation."
      >
        <Group title="Chart">
          {[
            "soft-blue",
            "sage",
            "dusty-rose",
            "dark-teal",
            "orange",
            "light-teal",
            "pink",
            "bright-yellow",
          ].map((n) => (
            <Swatch key={n} name={`chart-${n}`} color={`var(--color-chart-${n})`} />
          ))}
        </Group>
      </Section>

      <Section
        title="Role palette"
        description="Muted earth-tones used for avatars / categorisation."
      >
        <Group title="Role">
          {[
            "harbor-mist",
            "matcha",
            "rosewood",
            "wheat",
            "seafoam",
            "mauve",
            "peach-clay",
            "antique-pink",
          ].map((n) => (
            <Swatch key={n} name={`role-${n}`} color={`var(--color-role-${n})`} />
          ))}
        </Group>
      </Section>
    </Page>
  ),
};
