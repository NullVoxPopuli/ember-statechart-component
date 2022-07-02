import ts from 'rollup-plugin-ts';
import { defineConfig } from 'rollup';

import { Addon } from '@embroider/addon-dev/rollup';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

const rollupConfig = defineConfig({
  watch: {
    chokidar: {
      usePolling: true,
    },
  },

  output: {
    ...addon.output(),
    sourcemap: true,

    // Remove when we no longer import
    //
    // 8   │ import '@glint/template/-private/integration';
    hoistTransitiveImports: false,
  },

  plugins: [
    // These are the modules that users should be able to import from your
    // addon. Anything not listed here may get optimized away.
    addon.publicEntrypoints(['index.ts', 'registration.ts', 'glint.ts']),

    // These are the modules that should get reexported into the traditional
    // "app" tree. Things in here should also be in publicEntrypoints above, but
    // not everything in publicEntrypoints necessarily needs to go here.
    // addon.appReexports(['components/**/*.js', 'services/**/*.js']),

    ts({
      // can be changed to swc or other transpilers later
      // but we need the ember plugins converted first
      // (template compilation and co-location)
      transpiler: 'babel',
      babelConfig: './babel.config.cjs',
      browserslist: ['last 2 firefox versions', 'last 2 chrome versions'],
      tsconfig: {
        fileName: 'tsconfig.json',
        hook: (config) => ({
          ...config,
          declaration: true,
          // TODO: these aren't being generated? why?
          declarationMap: true,
          // See: https://devblogs.microsoft.com/typescript/announcing-typescript-4-5/#beta-delta
          // Allows us to use `exports` to define types per export
          // However, it was declared as not ready
          // as a result, we need extra / fallback references in the package.json
          declarationDir: './dist',
        }),
      },
    }),

    // Follow the V2 Addon rules about dependencies. Your code can import from
    // `dependencies` and `peerDependencies` as well as standard Ember-provided
    // package names.
    addon.dependencies(),

    // Ensure that standalone .hbs files are properly integrated as Javascript.
    // addon.hbs(),

    // addons are allowed to contain imports of .css files, which we want rollup
    // to leave alone and keep in the published output.
    // addon.keepAssets(['**/*.css']),

    // Remove leftover build artifacts when starting a new build.
    addon.clean(),
  ],
});

export default rollupConfig;
