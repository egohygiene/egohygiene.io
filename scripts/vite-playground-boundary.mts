import { realpathSync } from "node:fs";
import { isAbsolute, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

import type { Plugin } from "vite";

const playgroundRoot = fileURLToPath(new URL("../apps/playground/", import.meta.url));

/** Keep experiment modules out of public app builds, including through symlinks. */
export function excludePlayground(root = playgroundRoot): Plugin {
  const protectedRoot = realpathSync(root);
  return {
    name: "exclude-private-playground",
    enforce: "pre",
    load(id) {
      const filename = id.split("?")[0];
      if (!filename || !isAbsolute(filename)) return null;
      let actual: string;
      try {
        actual = realpathSync(filename);
      } catch {
        return null; // The normal resolver reports missing modules.
      }
      const path = relative(protectedRoot, actual);
      if (path === "" || (path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path))) {
        throw new Error("Public applications cannot import private playground modules.");
      }
      return null;
    },
  };
}
