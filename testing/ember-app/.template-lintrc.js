'use strict';

module.exports = {
  extends: 'recommended',
  overrides: [
    {
      files: ['tests/**'],
      rules: {
        'require-button-type': 'off'
      }
    }
  ],
};
