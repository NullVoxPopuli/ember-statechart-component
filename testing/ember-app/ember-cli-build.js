'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['ember-statechart-component'],
      webpack: {
        devtool: 'inline-source-map',
      },
    },
  });

  const { Webpack } = require('@embroider/webpack');

  return require('@embroider/compat').compatBuild(app, Webpack, {
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
        devtool: 'inline-source-map',
      },
    },
  });
};
