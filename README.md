
<p align="center">
  <br />

  <picture>
    <img alt="XState logotype" src="/logo-dark.png">
  </picture>
  <br />
    <strong>Actor-based state-management as components.</strong> <a href="https://stately.ai/docs">→ Documentation</a>
  <br />
  <br />
</p>


[![CI](https://github.com/NullVoxPopuli/ember-statechart-component/actions/workflows/ci.yml/badge.svg)](https://github.com/NullVoxPopuli/ember-statechart-component/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/ember-statechart-component.svg)](https://www.npmjs.com/package/ember-statechart-component)


Support
------------------------------------------------------------------------------

- XState >= 5
- TypeScript >= 5.2
- ember-source >= 5.1
- Glint >= 1.2.1

Installation
------------------------------------------------------------------------------

```bash
npm install ember-statechart-component
```

Anywhere in your app:

```ts
import 'ember-statechart-component';
```

This instructs Ember how to render and create actors from state machines.

## Migrating from XState v4?

See: https://stately.ai/docs/migration


Usage
------------------------------------------------------------------------------

```gjs
import { createMachine } from 'xstate';

const Toggler = createMachine({
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } },
  },
});

<template>
  <Toggler as |toggler|>
    {{toggler.statePath}}

    <button {{on 'click' (fn toggler.send 'TOGGLE')}}>
      Toggle
    </button>
  </Toggler>
</template>
```

### Accessing Ember Services

```gjs
import { getService } from 'ember-statechart-component';
import { setup } from 'xstate';

const AuthenticatedToggle = setup({
  actions: {
    notify: ({ context }) => {
      getService(context, 'toasts').notify('You must be logged in');
    },
  },
  guards: {
    isAuthenticated: ({ context }) => getService(context, 'session').isAuthenticated,
  },
}).createMachine({
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
});

<template>
  <AuthenticatedToggle as |toggle|>
    {{toggle.statePath}}

    <button {{on 'click' (fn toggle.send 'TOGGLE')}}>
      Toggle
    </button>
  </AuthenticatedToggle>
</template>
```


### Matching States

```hbs
<Toggle as |toggle|>
  {{#if (toggle.matches 'inactive')}}
    The inactive state
  {{else if (toggle.matches 'active')}}
    The active state
  {{else}}
    Unknown state
  {{/if}}

  <button {{on 'click' (fn toggle.send 'TOGGLE')}}>
    Toggle
  </button>
</Toggle>
```

### API


#### `@config`

This argument allows you to pass a [MachineOptions](https://xstate.js.org/docs/packages/xstate-fsm/#api) for [actions](https://xstate.js.org/docs/guides/actions.html), [services](https://xstate.js.org/docs/guides/communication.html#configuring-services), [guards](https://xstate.js.org/docs/guides/guards.html#serializing-guards), etc.

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

#### `@input`

Providing inputs from arguments works as you expect, following docs from [XState: Input](https://stately.ai/docs/input)

```glimmer-ts 
const Toggle = createMachine({
  types: {
    input: {} as { numCalled?: number },
  },
  initial: 'inactive',
  context: ({ input }) => {
    return {
      numCalled: input.numCalled ?? 0,
    };
  },
  states: {
    inactive: {
      entry: assign({
        numCalled: ({ context }) => context.numCalled + 1,
      }),
      on: { TOGGLE: 'active' },
    },
    active: {
      entry: assign({
        numCalled: ({ context }) => context.numCalled + 1,
      }),
      on: { TOGGLE: 'inactive' },
    },
  },
});

const input = {
  numCalled: 10,
};

<template>
  <Toggle @input={{input}} as |toggle|>
    {{toggle.statePath}}

    <button type="button" {{on "click" (fn toggle.send "TOGGLE")}}>
      Toggle
    </button>
  </Toggle>
</template>
```

#### `@context`

Sets the initial context. The current value of the context can then be accessed via `state.context`.

Usage:

<details><summary>Toggle machine that interacts with context</summary>

```js
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
<Toggle @context=(hash counter=0) as |toggle|>
  <button {{on 'click' (fn toggle.send 'TOGGLE')}}>
    Toggle
  </button>

  <p>
    Toggled: {{toggle.snapshot.context.counter}} times.
  </p>
</Toggle>
```

#### `@snapshot`

The machine will use `@snapshot` as the initial state.
Any changes to this argument
are not automatically propagated to the machine.
An update event (see details below) is sent instead.

### What happens if any of the passed args change?

An event will be sent to the machine for you, along
with all named arguments used to invoke the component.

To work with this event, use the constant provided by this library:

```js 

import { UPDATE_EVENT_NAME } from 'ember-statechart-component';


const MyMachine = createMachine({
  initial: 'inactive',
  states: {
    [UPDATE_EVENT_NAME]: { /* ... */
    /* ... */
  },
});
```

The value of this constant is just `EXTERNAL_UPDATE`, but the import makes it clear _why_ it exists, as the name does need to exactly match how the ember component manager is implemented for machines.


### API

The yielded value from an invoked state machine has some properties on it as well as the actor that allows you to "just defer to XState" for most situations. 

Given this a machine and its invocation, 
```gjs
import { createMachine } from 'xstate';

const Authenticator = createMachine({ /* ... */ });

<template>
  <Authenticator as |auth|>

    what is available on `auth`? 
  </Authenticator>
</template>
```

- `actor` - The underlying actor that XState manages, see: [The Actor Docs](https://stately.ai/docs/category/actors)
- `snapshot` - The most recent snapshot available from the actor
- `value` - alias for `snapshot.value`, which represents the name of the state, or an array of states, if the current state is nested.
- `statePath` - a dot-separated string representing the current `value`
- `matches` - The [matches function](https://stately.ai/docs/states#statematchesstatevalue)
- `onTransition` - A way to arbitrarily run code when the machine transitions. 



Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
