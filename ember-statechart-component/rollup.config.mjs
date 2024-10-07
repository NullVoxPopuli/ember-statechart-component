import { Addon } from "@embroider/addon-dev/rollup";

import { babel } from "@rollup/plugin-babel";
import { defineConfig } from "rollup";

const addon = new Addon({
  srcDir: "src",
  destDir: "dist",
});

const rollupConfig = defineConfig({
  output: addon.output(),
  plugins: [
    // These are the modules that users should be able to import from your
    // addon. Anything not listed here may get optimized away.
    addon.publicEntrypoints(["index.ts"]),

    // These are the modules that should get reexported into the traditional
    // "app" tree. Things in here should also be in publicEntrypoints above, but
    // not everything in publicEntrypoints necessarily needs to go here.
    // addon.appReexports(['components/**/*.js', 'services/**/*.js']),
    babel({
      extensions: [".js", ".gjs", ".ts", ".gts"],
      babelHelpers: "bundled",
    }),

    // Follow the V2 Addon rules about dependencies. Your code can import from
    // `dependencies` and `peerDependencies` as well as standard Ember-provided
    // package names.
    addon.dependencies(),
    addon.clean(),
  ],
});

export default rollupConfig;
