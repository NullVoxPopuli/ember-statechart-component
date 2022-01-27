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
