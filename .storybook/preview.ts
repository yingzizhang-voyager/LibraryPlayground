import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    /** Auto-detect any `on…` prop as a Storybook action — keeps the
     *  Controls panel free of callback fields. Stories can still override
     *  individual entries with `argTypes.<name>.action`. */
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    layout: "padded",
    backgrounds: {
      default: "neutral",
      values: [
        { name: "neutral", value: "#FAFAF9" },
        { name: "white", value: "#FFFFFF" },
      ],
    },
  },
};

export default preview;
