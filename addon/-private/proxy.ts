import { assert } from '@ember/debug';
import { isDestroyed, isDestroying } from '@ember/destroyable';
import { get as consumeTag, notifyPropertyChange as dirtyKey } from '@ember/object';

import { tracked, TrackedWeakMap } from 'tracked-built-ins';

import type { EventObject, Interpreter, State } from 'xstate';

export const UPDATE_EVENT_NAME = 'ARGS_UPDATE';

const CACHE = new TrackedWeakMap<Interpreter<unknown>, Record<string, unknown>>();

export function reactiveInterpreter(interpreter: Interpreter<unknown>) {
  CACHE.set(interpreter, tracked({}));

  interpreter.onTransition(async (_state: State<unknown>, event: EventObject) => {
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
        let tracking = CACHE.get(target);

        assert(`Tracking context lost!`, tracking);

        consumeTag(tracking, key);
      }

      return Reflect.get(target, key, receiver);
    },
  });
}

function dirtyState(interpreter: Interpreter<unknown>) {
  let tracking = CACHE.get(interpreter);

  assert(`Tracking context lost!`, tracking);

  dirtyKey(tracking, '_state');
}
