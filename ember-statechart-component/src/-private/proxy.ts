import { assert } from '@ember/debug';
import { isDestroyed, isDestroying } from '@ember/destroyable';

import { createStorage, getValue, setValue } from 'ember-tracked-storage-polyfill';

import type { TrackedStorage } from 'ember-tracked-storage-polyfill';
import type { EventObject, Interpreter, State } from 'xstate';

export const UPDATE_EVENT_NAME = 'ARGS_UPDATE';

const CACHE = new WeakMap<Interpreter<unknown>, TrackedStorage<null>>();

export function reactiveInterpreter(interpreter: Interpreter<unknown>) {
  ensureStorage(interpreter);

  interpreter.onTransition(async (_state: State<unknown>, event: EventObject) => {
    console.log(event.type);
    // init always runs, we don't need to dirty
    if (event.type === 'xstate.init') return;
    // a dirty event already triggered a transition
    // if we didn't early return here, we'd end up with
    // infinite invalidation
    if (event.type === UPDATE_EVENT_NAME) return;

    // wait till next (micro)task queue thing
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
    },
  });
}

function ensureStorage(interpreter: Interpreter<unknown>) {
  let storage = CACHE.get(interpreter);

  if (!storage) {
    storage = createStorage(null, () => false);
    CACHE.set(interpreter, storage);
  }

  return storage;
}

function dirtyState(interpreter: Interpreter<unknown>) {
  let storage = CACHE.get(interpreter);

  assert(`Tracking context lost!`, storage);

  setValue(storage, null);
}
