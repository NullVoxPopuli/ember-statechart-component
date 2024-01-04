'use strict';

const path = require('path');
const fs = require('fs');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = async function (defaults) {
  const { readPackageUpSync } = await import('read-package-up');

  let app = new EmberApp(defaults, {
    // Temporary until I upgrade the test app to vite
    trees: {
      app: (() => {
        let sideWatch = require('@embroider/broccoli-side-watch');

        let paths = ['ember-statechart-component'].map((libraryName) => {
          let entry = require.resolve(libraryName);
          let { packageJson, path: packageJsonPath } = readPackageUpSync({ cwd: entry });
          let packagePath = path.dirname(packageJsonPath);

          console.debug(
            `Side-watching ${libraryName} from ${packagePath}, which started in ${entry}`
          );

          let toWatch = packageJson.files
            .map((f) => path.join(packagePath, f))
            .filter((p) => {
              if (!fs.existsSync(p)) return false;
              if (!fs.lstatSync(p).isDirectory()) return false;

              return !p.endsWith('/src');
            });

          return toWatch;
        });

        return sideWatch('app', { watching: paths.flat() });
      })(),
    },
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
      // turn off the old transform
      // (for this to work when using Embroider you need https://github.com/embroider-build/embroider/pull/1673)
      disableDecoratorTransforms: true,
    },
    babel: {
      plugins: [
        // add the new transform.
        require.resolve('decorator-transforms'),
      ],
    },
  });

  const { Webpack } = require('@embroider/webpack');

  return require('@embroider/compat').compatBuild(app, Webpack, {
    extraPublicTrees: [],
    staticAddonTrees: true,
    staticAddonTestSupportTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    staticEmberSource: true,
    packageRules: [
      {
        package: 'ember-app',
        components: {
          '{{toggle}}': { safeToIgnore: true },
          '{{toggle-machine}}': { safeToIgnore: true },
          '{{test-machine}}': { safeToIgnore: true },
          '{{report}}': { safeToIgnore: true },
        },
      },
    ],
    packagerOptions: {
      webpackConfig: {
        devtool: 'source-map',
      },
    },
  });
};
