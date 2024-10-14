import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
// import { execaCommand } from "execa";

const manifestStr = await readFile(join(import.meta.dirname, "package.json"));
const manifest = JSON.parse(manifestStr);
// Why is this not default?
// Why else would you specify (peer)deps?
const externals = [
  ...Object.keys(manifest.dependencies ?? {}),
  ...Object.keys(manifest.peerDependencies ?? {}),
];

export default defineConfig({
  build: {
    outDir: "dist",
    // These targets are not "support".
    // A consuming app or library should compile further if they need to support
    // old browsers.
    target: ["esnext", "firefox121"],
    minify: false,
    sourcemap: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(import.meta.dirname, "src/index.ts"),
      name: "ember-statechart-component",
      formats: ["es"],
      // the proper extensions will be added
      fileName: "index",
    },
    rollupOptions: {
      external: [
        ...externals,
        "@ember/application",
        "@ember/component",
        "@ember/debug",
        "@ember/helper",
        "@ember/modifier",
        "@ember/owner",
        "@ember/destroyable",
        "@ember/template-compilation",
        "@glimmer/tracking",
        "@glint/template",
      ],
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
      outDir: "declarations",
    }),
    // {
    // name: "use-weird-non-ESM-ember-convention",
    // closeBundle: async () => {
    //   /**
    //    * Related issues
    //    * - https://github.com/embroider-build/embroider/issues/1672
    //    * - https://github.com/embroider-build/embroider/pull/1572
    //    * - https://github.com/embroider-build/embroider/issues/1675
    //    *
    //    * Fixed in embroider@4 and especially @embroider/vite
    //    */
    //   await execaCommand("cp dist/index.mjs dist/index.js", { stdio: "inherit" });
    //   console.log("⚠️ Incorrectly (but neededly) renamed MJS module to JS in a CJS package");
    //
    //   /**
    //    * https://github.com/microsoft/TypeScript/issues/56571#
    //    * README: https://github.com/NullVoxPopuli/fix-bad-declaration-output
    //    */
    //   await execaCommand(`pnpm fix-bad-declaration-output declarations/`, {
    //     stdio: "inherit",
    //   });
    //   console.log("⚠️ Dangerously (but neededly) fixed bad declaration output from typescript");
    // },
    // },
  ],
});
