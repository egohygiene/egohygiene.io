import { addons } from "storybook/manager-api";

import { egoHygieneTheme } from "./theme";

addons.setConfig({
  theme: egoHygieneTheme,

  panelPosition: "bottom",
  selectedPanel: undefined,

  showToolbar: true,
  enableShortcuts: true,

  sidebar: {
    showRoots: true,
    collapsedRoots: [],
  },
});

