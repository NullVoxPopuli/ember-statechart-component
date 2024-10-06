# Changelog

## [6.1.2](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v6.1.1...v6.1.2) (2022-07-31)


### Bug Fixes

* **args-update:** send ARGS_UPDATE less often ([dce62ad](https://github.com/NullVoxPopuli/ember-statechart-component/commit/dce62ad86fe3c9cce6b553a17c437379b32c245c))
* **package:** bump version ([9908645](https://github.com/NullVoxPopuli/ember-statechart-component/commit/9908645397588be51fc7961c06f0ea030547bd56))

## [6.1.1](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v6.1.0...v6.1.1) (2022-07-03)


### Bug Fixes

* **@config:** this arg is actually a `MachineOptions` type ([4fbb0f9](https://github.com/NullVoxPopuli/ember-statechart-component/commit/4fbb0f938b34193880f941c27e743b44795a5130))

# [6.1.0](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v6.0.1...v6.1.0) (2022-07-03)


### Features

* automatic glint registration via importing /glint ([cfea170](https://github.com/NullVoxPopuli/ember-statechart-component/commit/cfea170bab7722078352242abb125b31dc823d45))

## [6.0.1](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v6.0.0...v6.0.1) (2022-07-03)


### Bug Fixes

* **types:** use correct version of xstate ([33409cf](https://github.com/NullVoxPopuli/ember-statechart-component/commit/33409cf1e44d34d6750d7363ff5ca77d012346f9))

# [6.0.0](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v5.0.5...v6.0.0) (2022-07-03)


### Features

* bump minimum ember-source ([bd0a06c](https://github.com/NullVoxPopuli/ember-statechart-component/commit/bd0a06c1bd392a0627a5e156ea4e6dd383930f2c))
* glint support ([3509a18](https://github.com/NullVoxPopuli/ember-statechart-component/commit/3509a18a19a94027deb758b5f61afc7a602ea303))
* **glint:** provide type utilities for declaring machines as components ([1797ac8](https://github.com/NullVoxPopuli/ember-statechart-component/commit/1797ac8fca9a55a0d58f59a3416d937c461111a0))


### BREAKING CHANGES

*  - minimum ember support is v4.0.0
 - automatic component manager registration is removed
* minimum ember-source is 4 now

ember-template-imports requires at least ember-source3.27
and types are only compat with ember 4

## [5.0.5](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v5.0.4...v5.0.5) (2022-05-13)


### Bug Fixes

* **deps:** update dependency xstate to v4.32.1 ([59442b8](https://github.com/NullVoxPopuli/ember-statechart-component/commit/59442b8a0cfc6d7f9aecc8542dae4d12a0633c94))

## [5.0.4](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v5.0.3...v5.0.4) (2022-05-06)


### Bug Fixes

* **deps:** update dependency xstate to v4.32.0 ([63fa0f2](https://github.com/NullVoxPopuli/ember-statechart-component/commit/63fa0f21378bfb7373b78b7125e8e346a4ce46cd))

## [5.0.3](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v5.0.2...v5.0.3) (2022-04-11)


### Bug Fixes

* **deps:** update dependency babel-plugin-ember-template-compilation to v1.0.2 ([da33c35](https://github.com/NullVoxPopuli/ember-statechart-component/commit/da33c359284be3bb6ef42951fd3c6ee726b35496))

## [5.0.2](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v5.0.1...v5.0.2) (2022-04-08)


### Bug Fixes

* **deps:** update dependency xstate to v4.31.0 ([5ff8435](https://github.com/NullVoxPopuli/ember-statechart-component/commit/5ff84353e419d8c92c17146ec0bcd1e946e01fc1))

## [5.0.1](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v5.0.0...v5.0.1) (2022-04-08)


### Bug Fixes

* **deps:** update embroider monorepo to v1.6.0 ([e73c84d](https://github.com/NullVoxPopuli/ember-statechart-component/commit/e73c84d822ec1b8a146b8cb24ec3900187a3df06))

# [5.0.0](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v4.1.2...v5.0.0) (2022-03-22)


### Bug Fixes

* **types:** minor update in xstate cause breaking type change ([e786af7](https://github.com/NullVoxPopuli/ember-statechart-component/commit/e786af7cf16683cf12eeaacf1b4efbd206418b21))


### BREAKING CHANGES

* **types:** support latest xstate, ^4.30.0

## [4.1.2](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v4.1.1...v4.1.2) (2022-01-27)


### Bug Fixes

* **deps:** update dependency xstate to v4.29.0 ([7bb7773](https://github.com/NullVoxPopuli/ember-statechart-component/commit/7bb7773d90abdea339b7d616d8cd66d848ee31ab))

## [4.1.1](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v4.1.0...v4.1.1) (2022-01-21)


### Bug Fixes

* **deps:** update dependency xstate to v4.28.1 ([9bc493f](https://github.com/NullVoxPopuli/ember-statechart-component/commit/9bc493fd903f457e42c1cc5989a361b66a46081d))

# [4.1.0](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v4.0.1...v4.1.0) (2022-01-20)


### Features

* exposes onTransition helper ([0c54bab](https://github.com/NullVoxPopuli/ember-statechart-component/commit/0c54bab0e72b72cd733ed2aeb609e433010814b8))

## [4.0.1](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v4.0.0...v4.0.1) (2022-01-20)


### Bug Fixes

* **deps:** update dependency xstate to v4.28.0 ([5f61f8d](https://github.com/NullVoxPopuli/ember-statechart-component/commit/5f61f8d031e9b002f71494ed7325cc085d45d920))

# [4.0.0](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v3.2.3...v4.0.0) (2022-01-09)


### Features

* merge context by default ([74d921c](https://github.com/NullVoxPopuli/ember-statechart-component/commit/74d921c2845febd09dbf5832aa646cedb9a3f94c))
* merge passing context by default ([643a8c6](https://github.com/NullVoxPopuli/ember-statechart-component/commit/643a8c677359de0f8a94d50547f0417e7ee1e53a)), closes [#204](https://github.com/NullVoxPopuli/ember-statechart-component/issues/204)


### BREAKING CHANGES

* context is now merged instead of replaced

## [3.2.3](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v3.2.2...v3.2.3) (2022-01-08)


### Bug Fixes

* **revert:** spawn fix accidentally introduced infinite loop ([78e2582](https://github.com/NullVoxPopuli/ember-statechart-component/commit/78e2582ac0b10d67ce95abcd49c44616526af069))

## [3.2.2](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v3.2.1...v3.2.2) (2022-01-08)


### Bug Fixes

* **spawn:** for spawn machines stored on nested context data, support reactivity ([3a1ca73](https://github.com/NullVoxPopuli/ember-statechart-component/commit/3a1ca739fa29e91cdd6d4e139eac428a7249f84e))

## [3.2.1](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v3.2.0...v3.2.1) (2021-12-30)


### Bug Fixes

* **deps:** update dependency xstate to v4.27.0 ([d3cfe32](https://github.com/NullVoxPopuli/ember-statechart-component/commit/d3cfe3230009afe0cc91de44fcabcfe989e5ba47))

# [3.2.0](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v3.1.0...v3.2.0) (2021-12-23)


### Features

* **manager:** official support spawn and invoke ([a34d193](https://github.com/NullVoxPopuli/ember-statechart-component/commit/a34d193baf20ffb0963770219e8e4792d9c6c604))

# [3.1.0](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v3.0.1...v3.1.0) (2021-12-12)


### Features

* **internal:** convert to the Addon@v2 format ([54fca76](https://github.com/NullVoxPopuli/ember-statechart-component/commit/54fca76627453423782096cf5d685abe1dfde0aa))

## [3.0.1](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v3.0.0...v3.0.1) (2021-12-06)


### Bug Fixes

* **deps:** update dependency ember-cli-htmlbars to v6.0.1 ([c872839](https://github.com/NullVoxPopuli/ember-statechart-component/commit/c872839cc2e9add8c493369cb6f1b55b001964e2))

# [3.0.0](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v2.3.7...v3.0.0) (2021-12-05)


### Bug Fixes

* **deps:** update dependency tracked-maps-and-sets to v3 ([40618e9](https://github.com/NullVoxPopuli/ember-statechart-component/commit/40618e92be004c2a595ceaacac3c51ab3c10151c))


### chore

* drop support for node 12 ([b1b3c4c](https://github.com/NullVoxPopuli/ember-statechart-component/commit/b1b3c4c64e0b745c43c2dfe9f745757d71c7f2f3))
* **ci:** update test matrix ([91de3bb](https://github.com/NullVoxPopuli/ember-statechart-component/commit/91de3bb2e80c8338998d4b6a7f7ddef2e650b68c))
* **deps:** pin @babel/helper-create-class-features-plugin ([1a8111b](https://github.com/NullVoxPopuli/ember-statechart-component/commit/1a8111b364cdd6d162982784c6c754187735f9f3)), closes [/github.com/babel/ember-cli-babel/issues/419#issuecomment-985735309](https://github.com//github.com/babel/ember-cli-babel/issues/419/issues/issuecomment-985735309)


### BREAKING CHANGES

* node 12 is no longer supported
* **ci:** drop support for ember 3.26
* **deps:** this package now requires ember-auto-import@v2

## [2.3.7](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v2.3.6...v2.3.7) (2021-08-13)


### Bug Fixes

* **deps:** update dependency ember-auto-import to ^1.12.0 ([84b04e8](https://github.com/NullVoxPopuli/ember-statechart-component/commit/84b04e8885c4a7ccc270c34cbcc184e2596ed2b2))

## [2.3.6](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v2.3.5...v2.3.6) (2021-06-17)


### Bug Fixes

* **deps:** update dependency ember-cli-typescript to ^4.2.1 ([279635e](https://github.com/NullVoxPopuli/ember-statechart-component/commit/279635efb4f736fce3d18903231e61d812402c39))

## [2.3.5](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v2.3.4...v2.3.5) (2021-06-15)


### Bug Fixes

* **deps:** update dependency ember-cli-typescript to ^4.2.0 ([618aca6](https://github.com/NullVoxPopuli/ember-statechart-component/commit/618aca6cf1dc470992ccd6d5d0d4f3094788e83d))

## [2.3.4](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v2.3.3...v2.3.4) (2021-05-18)


### Bug Fixes

* **deps:** update dependency ember-cli-babel to ^7.26.6 ([9edf718](https://github.com/NullVoxPopuli/ember-statechart-component/commit/9edf718724e6b914e7eaebfb007b2cf197949b51))

## [2.3.3](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v2.3.2...v2.3.3) (2021-05-10)


### Bug Fixes

* **readme:** add browser requirements ([252f1a0](https://github.com/NullVoxPopuli/ember-statechart-component/commit/252f1a0503700675c8f217bb4069fd60c6ba3009)), closes [PR#33](https://github.com/PR/issues/33)

## [2.3.2](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v2.3.1...v2.3.2) (2021-05-06)


### Bug Fixes

* **deps:** update dependency ember-cli-babel to ^7.26.5 ([635417f](https://github.com/NullVoxPopuli/ember-statechart-component/commit/635417f81f41fcd38a181f33a164d815fa4ba3fc))

## [2.3.1](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v2.3.0...v2.3.1) (2021-04-30)


### Bug Fixes

* **runloop:** prevent infinite invalidation bugs ([fae96bd](https://github.com/NullVoxPopuli/ember-statechart-component/commit/fae96bd64b35044c1b2fbb9f09e9273e8cdf5ce1))

# [2.3.0](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v2.2.3...v2.3.0) (2021-04-29)


### Bug Fixes

* **deps:** move ember-auto-import to dependencies ([fac6ac0](https://github.com/NullVoxPopuli/ember-statechart-component/commit/fac6ac0550cc26a4024d655815308ed0d425d3d3))


### Features

* support embroider ([6044337](https://github.com/NullVoxPopuli/ember-statechart-component/commit/6044337f79f0d6f06d89c126c1114f6fd60e9c65))

## [2.2.3](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v2.2.2...v2.2.3) (2021-04-28)


### Bug Fixes

* **deps:** update dependency ember-cli-babel to ^7.26.4 ([c30df0a](https://github.com/NullVoxPopuli/ember-statechart-component/commit/c30df0a7c59b1fb94d263fd63bcc48909b121b61))

## [2.2.2](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v2.2.1...v2.2.2) (2021-04-24)


### Bug Fixes

* **deps:** update dependency tracked-built-ins to ^1.1.1 ([9057cd7](https://github.com/NullVoxPopuli/ember-statechart-component/commit/9057cd76b5d416d5a124d7b436c05b1852f666fa))

## [2.2.1](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v2.2.0...v2.2.1) (2021-04-24)


### Bug Fixes

* **internal:** fill out missing package.json fields ([fed4577](https://github.com/NullVoxPopuli/ember-statechart-component/commit/fed4577d59392ff93e2f15686092bee4dca24003))

# [2.2.0](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v2.1.0...v2.2.0) (2021-04-24)


### Features

* support accessing services ([446ac64](https://github.com/NullVoxPopuli/ember-statechart-component/commit/446ac648f8a2d209d16b29603e8c73ee30e3f163))

# [2.1.0](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v2.0.0...v2.1.0) (2021-04-23)


### Features

* new default template ([e3be573](https://github.com/NullVoxPopuli/ember-statechart-component/commit/e3be5732ba404983e220526248edf0043cc818d7))

# [2.0.0](https://github.com/NullVoxPopuli/ember-statechart-component/compare/v1.0.0...v2.0.0) (2021-04-23)


### Features

* initial release ([64a1aec](https://github.com/NullVoxPopuli/ember-statechart-component/commit/64a1aece7cef6bde06c9f5739ea427d88b6e7c2c))


### BREAKING CHANGES

* first release to NPM

# 1.0.0 (2021-04-23)


### Bug Fixes

* **ci:** invoke semantic-release directly ([2d12cbe](https://github.com/NullVoxPopuli/ember-statechart-component/commit/2d12cbe23950c0b167a74b78980a69d517e48919))


### Features

* basic reactivity implemented ([1bc4e28](https://github.com/NullVoxPopuli/ember-statechart-component/commit/1bc4e28500b1a3ca10a92f34ce64170e55aa1365))


### BREAKING CHANGES

* first release
