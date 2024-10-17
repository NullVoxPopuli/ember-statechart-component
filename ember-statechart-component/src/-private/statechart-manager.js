import { assert } from '@ember/debug';
import { tracked } from '@glimmer/tracking';
import { capabilities } from '@ember/component';
import { associateDestroyableChild, destroy, isDestroying } from '@ember/destroyable';
import { getOwner, setOwner } from '@ember/owner';
import { cancel, later } from '@ember/runloop';

import { createActor } from 'xstate';

export const UPDATE_EVENT_NAME = 'EXTERNAL_UPDATE';
const STOP = Symbol.for('__ESM__STOP__');
const START = Symbol.for('__ESM__START__');
const HANDLE_UPDATE = Symbol.for('__ESM__HANDLE_UPDATE__');

class ReactiveActor {
  /**
   * @private
   */
  @tracked lastSnapshot;

  #actor;
  #callbacks = [];

  /**
   * The most recent snapshot available from the actor
   */
  get snapshot() {
    return this.lastSnapshot;
  }

  /**
   * Alias fort the value of the snapshot
   */
  get value() {
    return this.snapshot?.value;
  }

  /**
   * The dot-separated name of the current state
   */
  get statePath() {
    let x = this.value;

    if (typeof x === 'string') {
      return x;
    }

    if (typeof x === 'object') {
      if (!x) return '';

      if ('toStrings' in x) return x.toStrings();
      if ('toString' in x) return x.toString();
    }

    return `${x}`;
  }

  /**
   * The running actor, directly from XState
   */
  get actor() {
    return this.#actor;
  }

  constructor(actor, owner) {
    this.#actor = actor;
    setOwner(this, owner);

    let initialSnapshot = actor.getSnapshot();
    let context = initialSnapshot.context;

    assert(
      `Machine init failed with error: ${initialSnapshot?.error?.message}`,
      !initialSnapshot?.error?.message
    );

    // Required for services to be accessible
    setOwner(context, owner);

    this.lastSnapshot = initialSnapshot;

    actor.subscribe(async (snapshot) => {
      await Promise.resolve();

      if (this.lastSnapshot === snapshot) return;

      this.lastSnapshot = snapshot;
      this.#callbacks.forEach((fn) => fn(snapshot));
    });
  }

  /**
   * Forwards to the underlying actor.send,
   * but re-enables passing vanilla strings as events,
   * rather than needing to create an object for each event.
   * (XState docs recommend send({ type: EVENT_NAME }))
   */
  send = (...args) => {
    if (typeof args[0] === 'string') {
      this.#actor.send({ type: args[0] });

      return;
    }

    this.#actor.send(...args);
  };

  /**
   * subscribe to changes in the machine state
   */
  onTransition = (callback) => {
    this.#callbacks.push(callback);
  };

  [START] = () => this.#actor.start();
  [STOP] = () => this.#actor.stop();
  [HANDLE_UPDATE] = (args) => {
    if (Object.keys(args.named).length > 0 || args.positional.length > 0) {
      this.send(UPDATE_EVENT_NAME, args.named);
    }
  };
}

export default class ComponentManager {
  capabilities = capabilities('3.13', {
    destructor: true,
    updateHook: true,
  });

  static create(owner) {
    let manager = new ComponentManager();

    setOwner(manager, owner);

    return manager;
  }

  createComponent(machine, args) {
    let { named } = args;

    if ('config' in named) {
      machine = machine.provide(named['config']);
    }

    let options = {
      context: {},
      clock: {
        setTimeout(fn, ms) {
          return later.call(null, fn, ms);
        },
        clearTimeout(timer) {
          return cancel.call(null, timer);
        },
      },
    };

    if ('input' in named) {
      options.input = named['input'];
    }

    if ('context' in named) {
      options.context = named['context'];
    }

    if ('snapshot' in named) {
      options.snapshot = named['snapshot'];
    }

    let owner = getOwner(this);

    setOwner(options.context, owner);

    let actor = createActor(machine, options);
    let state = new ReactiveActor(actor, owner);

    associateDestroyableChild(actor, this);

    state[START]();

    return state;
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
  updateComponent(state, args) {
    state[HANDLE_UPDATE](args);
  }

  destroyComponent(state) {
    if (isDestroying(state)) {
      return;
    }

    state[STOP]();

    destroy(state);
  }

  getContext(state) {
    return state;
  }
}
