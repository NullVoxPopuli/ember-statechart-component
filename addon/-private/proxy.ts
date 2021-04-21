import { assert } from '@ember/debug';
import { get as consumeTag, notifyPropertyChange as dirtyKey } from '@ember/object';

import { tracked, TrackedWeakMap } from 'tracked-built-ins';

import type { Interpreter } from 'xstate';

const CACHE = new TrackedWeakMap<Interpreter<unknown>, Record<string, unknown>>();

export function reactiveInterpreter(interpreter: Interpreter<unknown>) {
  CACHE.set(interpreter, tracked({}));

  interpreter.onTransition(() => {
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
