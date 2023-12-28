"use strict";

const { configs } = require("@nullvoxpopuli/eslint-configs");

const config = configs.ember();

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: ["**/*.ts"],
      rules: {
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
};
