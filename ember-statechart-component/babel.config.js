import { createRequire } from 'module';
import { precompile } from '@glimmer/compiler';

const require = createRequire(import.meta.url);
const resolve = require.resolve;

export default {
  plugins: [
    [
      resolve('@babel/plugin-transform-typescript'),
      {
        allowDeclareFields: true,
        onlyRemoveTypeImports: true,
        // Default enums are IIFEs
        optimizeConstEnums: true,
      },
    ],
    [
      resolve('@babel/plugin-proposal-class-properties'),
      {
        // Only support browsers that also support class properties...
        // If all addons do this, it greatly reduces shipped JS
        loose: true,
      },
    ],
    [
      resolve('babel-plugin-ember-template-compilation'),
      {
        precompile,
        enableLegacyModules: ['ember-cli-htmlbars'],
      },
    ],
    resolve('@embroider/addon-dev/template-colocation-plugin'),
  ],
};
