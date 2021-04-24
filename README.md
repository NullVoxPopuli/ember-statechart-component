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

Usage:

```hbs
<Toggle as |state send|>
  {{state.value}}

  <button type='button' {{on 'click' (fn send 'TOGGLE')}}>
    Toggle
  </button>
</Toggle>
```

The default template for every `createMachine(..)` is
```hbs
{{yield this.state this.send}}
```
but that can be overriden to suit your needs by defining your own template.
the `this` is an instance of the [XState Interpreter](https://xstate.js.org/api/classes/interpreter.html)

### Accessing Services

```js
// app/components/authenticated-toggle.js
import { getService } from 'ember-statechart-component';
import { createMachine } from 'xstate';

export default createMachine({
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        TOGGLE: [
          {
            target: 'active',
            cond: 'isAuthenticated',
          },
          { actions: ['notify'] },
        ],
      },
    },
    active: { on: { TOGGLE: 'inactive' } },
  },
}, {
  actions: {
    notify: (ctx) => {
      getService(ctx, 'toasts').notify('You must be logged in');
    },
  },
  guards: {
    isAuthenticated: (ctx) => getService(ctx, 'session').isAuthenticated,
  },
});
```

Usage:

```hbs
<AuthenticatedToggle as |state send|>
  {{state.value}}

  <button type='button' {{on 'click' (fn send 'TOGGLE')}}>
    Toggle
  </button>
</AuthenticatedToggle>
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
