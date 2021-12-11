import { createTemplateFactory } from '@ember/template-factory';
import { capabilities, setComponentManager, setComponentTemplate } from '@ember/component';
import { interpret, State, StateNode } from 'xstate';
import { DEBUG } from '@glimmer/env';
import { setOwner, getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { isDestroyed, isDestroying, destroy } from '@ember/destroyable';
import { later, cancel } from '@ember/runloop';
import { getValue, createStorage, setValue } from 'ember-tracked-storage-polyfill';

const UPDATE_EVENT_NAME = 'ARGS_UPDATE';
const CACHE = new WeakMap();
function reactiveInterpreter(interpreter) {
  ensureStorage(interpreter);
  interpreter.onTransition(async (_state, event) => {
    // init always runs, we don't need to dirty
    if (event.type === 'xstate.init') return; // a dirty event already triggered a transition
    // if we didn't early return here, we'd end up with
    // infinite invalidation

    if (event.type === UPDATE_EVENT_NAME) return; // wait till next (micro)task queue thing
    // we don't "need" to do this, but it keeps linting from
    // removing the async from the arrow function, which we *do*
    // need because we don't want dirty events to happen in the same
    // run loop as a read (which can happen with synchronous changes
    // in the interpreter)

    await Promise.resolve();

    if (isDestroyed(interpreter) || isDestroying(interpreter)) {
      return;
    }

    dirtyState(interpreter);
  });
  return new Proxy(interpreter, {
    get(target, key, receiver) {
      if (key === '_state') {
        let storage = ensureStorage(target);
        getValue(storage);
      }

      return Reflect.get(target, key, receiver);
    }

  });
}

function ensureStorage(interpreter) {
  let storage = CACHE.get(interpreter);

  if (!storage) {
    storage = createStorage(null, () => false);
    CACHE.set(interpreter, storage);
  }

  return storage;
}

function dirtyState(interpreter) {
  let storage = CACHE.get(interpreter);
  assert(`Tracking context lost!`, storage);
  setValue(storage, null);
}

/* eslint-disable @typescript-eslint/ban-types */
class ComponentManager {
  constructor() {
    this.capabilities = capabilities('3.13', {
      destructor: true,
      updateHook: true
    });
  }

  static create(owner) {
    let manager = new ComponentManager();
    setOwner(manager, owner);
    return manager;
  }

  createComponent(machine, args) {
    let {
      named
    } = args;

    if ('config' in named) {
      machine = machine.withConfig(named.config);
    }

    let context = {};

    if ('context' in named) {
      Object.assign(context, named.context);
    }

    setOwner(context, getOwner(this));
    machine = machine.withContext(context);
    let interpreter = interpret(machine, {
      devTools: DEBUG,
      clock: {
        setTimeout(fn, ms) {
          return later.call(null, fn, ms);
        },

        clearTimeout(timer) {
          return cancel.call(null, timer);
        }

      }
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

  updateComponent(interpreter, args) {
    interpreter.send(UPDATE_EVENT_NAME, args.named);
  }

  destroyComponent(interpreter) {
    if (isDestroying(interpreter)) {
      return;
    }

    interpreter.stop();
    destroy(interpreter);
  }

  getContext(interpreter) {
    return interpreter;
  }

}

setComponentManager(owner => ComponentManager.create(owner), StateNode.prototype);
setComponentTemplate(createTemplateFactory(
/*
  {{yield this.state this.send}}
*/
{
  "id": "lckURGW9",
  "block": "[[[18,1,[[30,0,[\"state\"]],[30,0,[\"send\"]]]]],[\"&default\"],false,[\"yield\"]]",
  "moduleName": "(unknown template module)",
  "isStrictMode": false
}), StateNode.prototype);
function initialize() {
  /* intentionally empty */
}
var registration = {
  initialize
};

export { registration as default, initialize };
