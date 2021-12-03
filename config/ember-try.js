'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    scenarios: [
      {
        name: 'ember-3.25',
        npm: {
          devDependencies: {
            'ember-source': '~3.25.0',
          },
        },
      },
      {
        name: 'ember-3.28',
        npm: {
          devDependencies: {
            '@babel/helper-create-class-features-plugin': '7.14.6',
            'ember-source': '~3.28.0',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            '@babel/helper-create-class-features-plugin': '7.14.6',
            'ember-source': await getChannelURL('release'),
          },
        },
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            '@babel/helper-create-class-features-plugin': '7.14.6',
            'ember-source': await getChannelURL('beta'),
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            '@babel/helper-create-class-features-plugin': '7.14.6',
            'ember-source': await getChannelURL('canary'),
          },
        },
      },
      embroiderSafe({
        npm: {
          devDependencies: {
            '@babel/helper-create-class-features-plugin': '7.14.6',
          },
        },
      }),
      embroiderOptimized({
        npm: {
          devDependencies: {
            '@babel/helper-create-class-features-plugin': '7.14.6',
          },
        },
      }),
    ],
  };
};
