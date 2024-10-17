'use strict';

module.exports = {
  extends: 'recommended',
  overrides: [
    {
      files: ['**/*'],
      rules: {
        'require-input-label': 'off',
        'no-block-params-for-html-elements': 'off',
        'no-passed-in-event-handlers': 'off',
      },
    },
  ],
};
