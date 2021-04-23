ember-statechart-component
==============================================================================

Use [XState](https://xstate.js.org/) Machines *as* components.

Installation
------------------------------------------------------------------------------

```bash
ember install ember-statechart-component
# or
npm install ember-statechart-component
# or
yarn add ember-statechart-component
```

Usage
------------------------------------------------------------------------------

Example with Ember Octane

```js
// app/components/toggle.js
import { createMachine } from 'xstate';

export default createMachine({
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } },
  },
});
```
```hbs
{{!-- app/components/toggle.hbs --}}
{{yield this.state this.send}}
```

Usage of this "toggle" component:

```hbs
<Toggle as |state send|>
  {{state.value}}

  <button type='button' {{on 'click' (fn send 'TOGGLE')}}>
    Toggle
  </button>
</Toggle>
```

### API

#### `@config`

This argument allows you to pass a `MachineConfig` for actions, services, guards, etc

#### `@context`

Sets the initial context

#### `@state`

The machine will use this state as the initial state. Any changes to
this argument are ignored.



Compatibility
------------------------------------------------------------------------------

* Ember.js v3.25 or above
* Node.js v12 or above


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
