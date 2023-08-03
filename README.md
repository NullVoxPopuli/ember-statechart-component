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
we will first need `ember-source@4.5+` or a [HelperManager](https://github.com/emberjs/rfcs/pull/625) for
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

In app/app.js / app/app.ts, a one time setup function will need to be called so that the ComponentManager is registered.

```ts
import Application from '@ember/application';

import config from 'ember-app/config/environment';
import loadInitializers from 'ember-load-initializers';
import Resolver from 'ember-resolver';

import { setupComponentMachines } from 'ember-statechart-component';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);

setupComponentMachines();
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

### Glint

Having type checking with these state machines can be done automatically
after importing the `/glint` file in your `types/<app-name>/glint-registry.d.ts`.

```ts
import "@glint/environment-ember-loose";
import "@glint/environment-ember-loose/native-integration";
import "ember-page-title/glint";

// This import extends the type of `StateMachine` to be glint-compatible
import 'ember-statechart-component/glint';

declare module "@glint/environment-ember-loose/registry" {
  export default interface Registry {
    // How to define globals from external addons
  }
}
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

* [ember-source][gh-ember-source] v3.28+
* [typescript][gh-typescript] v4.5+
* [ember-auto-import][gh-ember-auto-import] v2+
* A browser that supports [Proxy](https://caniuse.com/proxy)
* [Glint][gh-glint] 0.8.3+
  * Note that updates to glint support will not be covered by this library's adherance to SemVer. All glint-related updates will be bugfixes until Glint is declared stable.

[gh-glint]: https://github.com/typed-ember/glint/
[gh-ember-auto-import]: https://github.com/ef4/ember-auto-import
[gh-ember-source]: https://github.com/emberjs/ember.js/
[gh-typescript]: https://github.com/Microsoft/TypeScript/releases

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
