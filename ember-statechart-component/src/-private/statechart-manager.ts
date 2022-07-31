/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: remove all the any types -- xstate requires too many generics
import { DEBUG } from '@glimmer/env';
import { getOwner, setOwner } from '@ember/application';
import { capabilities } from '@ember/component';
import { assert } from '@ember/debug';
import { destroy, isDestroying } from '@ember/destroyable';
import { cancel, later } from '@ember/runloop';

import { interpret, State } from 'xstate';

import { reactiveInterpreter, UPDATE_EVENT_NAME } from './proxy';

import type { Interpreter, StateNode } from 'xstate';

export interface Args {
  named: Record<string, unknown>;
  positional: unknown[];
}

export default class ComponentManager {
  capabilities = capabilities('3.13', {
    destructor: true,
    updateHook: true,
  });

  static create(owner: unknown) {
    let manager = new ComponentManager();

    setOwner(manager, owner);

    return manager;
  }

  createComponent(machine: StateNode, args: Args) {
    let { named } = args;

    if ('config' in named) {
      machine = machine.withConfig(named.config as any);
    }

    let context = { ...machine.context };

    if ('context' in named) {
      Object.assign(context, named.context);
    }

    setOwner(context, getOwner(this));

    machine = machine.withContext(context);

    let interpreter = interpret(machine as any, {
      devTools: DEBUG,
      clock: {
        setTimeout(fn, ms) {
          return (later as any).call(null, fn, ms);
        },
        clearTimeout(timer) {
          return cancel.call(null, timer);
        },
      },
    });

    if ('state' in named) {
      assert(`@state must be of type State`, named.state instanceof State);

      let resolvedState = machine.resolveState(named.state);

      let withReactivity = reactiveInterpreter(interpreter);

      withReactivity.start(resolvedState);

      return withReactivity;
    }

    /**
     * Start the interpreter before we wire in reactivity,
     * so reactivity may only be "by-use" (from the app), rather than
     * managed by XState during its internal updates
     */
    interpreter.start();

    let withReactivity = reactiveInterpreter(interpreter);

    return withReactivity;
  }

  /**
   * updateComponent is called every time context changes, because context is tracked data
   * and is read during `createComponent`.
   *
   * This is why we neeed to guard this UPDATE_EVENT_NAME around a condition about if there
   * even are args.
   *
   * This isn't a perfect solution, but for the common use case of
   * "handle everything within the statechart and don't pass args",
   * it should be good enough.
   */
  updateComponent(interpreter: Interpreter<any>, args: Args) {
    if (Object.keys(args.named).length > 0 || args.positional.length > 0) {
      interpreter.send(UPDATE_EVENT_NAME, args.named);
    }
  }

  destroyComponent(interpreter: Interpreter<any>) {
    if (isDestroying(interpreter)) {
      return;
    }

    interpreter.stop();

    destroy(interpreter);
  }

  getContext(interpreter: Interpreter<any>) {
    return interpreter;
  }
}
