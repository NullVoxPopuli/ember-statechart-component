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

To be able to use XState [`state.matches`](https://xstate.js.org/docs/guides/states.html#state-matches-parentstatevalue)
method in our templates,
we will first need a [HelperManager](https://github.com/emberjs/rfcs/pull/625) for
handling vanilla functions.
[ember-functions-as-helper-polyfill](https://github.com/NullVoxPopuli/ember-functions-as-helper-polyfill)
provides one:

```bash
ember install ember-functions-as-helper-polyfill
# or
npm install ember-functions-as-helper-polyfill
# or
yarn add ember-functions-as-helper-polyfill
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
The `this` is an instance of the [XState Interpreter](https://xstate.js.org/api/classes/interpreter.html)

### Accessing EmberJS Services

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

This argument allows you to pass a MachineConfig for [actions](https://xstate.js.org/docs/guides/actions.html), [services](https://xstate.js.org/docs/guides/communication.html#configuring-services), [guards](https://xstate.js.org/docs/guides/guards.html#serializing-guards), etc.

Usage:

<details><summary>Toggle machine that needs a config</summary>
  
```js
// app/components/toggle.js
import { createMachine, assign } from 'xstate';

export default createMachine({
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { 
      on: { 
        TOGGLE: {
          target: 'inactive',
          actions: ['toggleIsOn']
        }
      }
    },
  },
});
```

</details>

```hbs
<Toggle 
  @config={{hash 
    actions=(hash 
      toggleIsOn=@onRoomIlluminated
    )
  }} 
as |state send|>
  <button {{on 'click' (fn send 'TOGGLE')}}>
    Toggle
  </button>
</Toggle>
```

#### `@context`

Sets the initial context. The current value of the context can then be accessed via `state.context`.

Usage:

<details><summary>Toggle machine that interacts with context</summary>

```js
// app/components/toggle.js
import { createMachine, assign } from 'xstate';

export default createMachine({
  initial: 'inactive',
  states: {
    inactive: { 
      on: { 
        TOGGLE: {
          target: 'active',
          actions: ['increaseCounter']
        }
      }
    },
    active: { 
      on: { 
        TOGGLE: {
          target: 'inactive',
          actions: ['increaseCounter']
        }
      }
    },
  },
}, {
  actions: {
    increaseCounter: assign({
      counter: (context) => context.counter + 1
    })
  }
});
```

</details>

```hbs
<Toggle @context=(hash counter=0) as |state send|>
  <button {{on 'click' (fn send 'TOGGLE')}}>
    Toggle
  </button>

  <p>
    Toggled: {{state.context.counter}} times.
  </p>
</Toggle>
```

#### `@state`

The machine will use `@state` as the initial state.
Any changes to this argument 
are not automatically propagated to the machine. 
An `ARGS_UPDATE` event (see details below) is sent instead.

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
