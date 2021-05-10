ember-statechart-component
==============================================================================

[![CI](https://github.com/NullVoxPopuli/ember-statechart-component/actions/workflows/ci.yml/badge.svg)](https://github.com/NullVoxPopuli/ember-statechart-component/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/ember-statechart-component.svg)](https://www.npmjs.com/package/ember-statechart-component)


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

  <button {{on 'click' (fn send 'TOGGLE')}}>
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

  <button {{on 'click' (fn send 'TOGGLE')}}>
    Toggle
  </button>
</AuthenticatedToggle>
```

### Matching States

XState provides its own [`matches`](https://xstate.js.org/api/classes/state.html#matches)
method which is available on the `state` object.
We can utilize this provided there exists a `HelperManager` for
handling vanilla functions, such as what
[ember-could-get-used-to-this](https://github.com/pzuraq/ember-could-get-used-to-this)
provides.


```hbs
<Toggle as |state send|>
  {{#if (state.matches 'inactive')}}
    The inactive state
  {{else if (state.matches 'active')}}
    The active state
  {{else}}
    Unknown state
  {{/if}}

  <button {{on 'click' (fn send 'TOGGLE')}}>
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


### What happens if any of the passed args change?

An event will be sent to the machine for you, `ARGS_UPDATE`, along
with all named arguments used to invoke the component.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.25 or above
* Node.js v12 or above
* A browser that supports [Proxy](https://caniuse.com/proxy)


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
