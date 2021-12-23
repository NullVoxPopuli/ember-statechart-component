import { nodeResolve } from '@rollup/plugin-node-resolve';

import { babel } from '@rollup/plugin-babel';

import { Addon } from '@embroider/addon-dev/rollup';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

const extensions = ['.js', '.ts'];

const transpilation = [
  nodeResolve({ resolveOnly: ['./'], extensions }),
  babel({ babelHelpers: 'bundled', extensions }),
  addon.dependencies(),
  addon.hbs(),
];

export default [
  {
    input: 'src/index.ts',
    output: { ...addon.output(), entryFileNames: '[name].js' },
    plugins: [...transpilation],
  },
  {
    input: 'src/registration.ts',
    output: {
      ...addon.output(),
      entryFileNames: 'instance-initializers/setup-ember-statechart-component.js',
    },
    plugins: [
      // These are the modules that users should be able to import from your
      // addon. Anything not listed here may get optimized away.
      addon.publicEntrypoints(['instance-initializers/*.js']),

      // These are the modules that should get reexported into the traditional
      // "app" tree. Things in here should also be in publicEntrypoints above, but
      // not everything in publicEntrypoints necessarily needs to go here.
      addon.appReexports(['instance-initializers/setup-ember-statechart-component.js']),
      ...transpilation,
    ],
  },
];
