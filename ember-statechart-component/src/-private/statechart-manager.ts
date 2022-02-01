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

    let withReactivity = reactiveInterpreter(interpreter);

    withReactivity.start();

    return withReactivity;
  }

  updateComponent(interpreter: Interpreter<any>, args: Args) {
    interpreter.send(UPDATE_EVENT_NAME, args.named);
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
