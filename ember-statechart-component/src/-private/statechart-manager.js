import { tracked } from '@glimmer/tracking';
import { getOwner, setOwner } from '@ember/application';
import { capabilities } from '@ember/component';
import { destroy, isDestroying, associateDestroyableChild } from '@ember/destroyable';

import { waitForPromise } from '@ember/test-waiters';
import { toPromise, createActor } from 'xstate';

const UPDATE_EVENT_NAME = 'UPDATE';

class ReactiveActor {
  @tracked lastSnapshot;

  #actor;
  #callbacks = [];

  get state() {
    return this.lastSnapshot;
  }

  constructor(actor, owner) {
    this.#actor = actor;
    setOwner(this, owner);

    let initialSnapshot = actor.getSnapshot();
    let context = initialSnapshot.context;

    setOwner(context, owner);

    this.lastSnapshot = initialSnapshot;

    actor.subscribe((snapshot) => {
      this.lastSnapshot = snapshot;
      this.#callbacks.forEach((fn) => fn(snapshot));
    });
  }

  start = () => this.#actor.start();
  stop = () => this.#actor.stop();
  send = (...args) => {
    if (typeof args[0] === 'string') {
      this.#actor.send({ type: args[0] });
      return;
    }

    this.#actor.send(...args);
  };

  handleUpdate = (args) => {
    if (Object.keys(args.named).length > 0 || args.positional.length > 0) {
      this.send(UPDATE_EVENT_NAME, args.named);
    }
  };

  onTransition = (callback) => {
    this.#callbacks.push(callback);
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

    let input = {};
    let context = {};

    if ('input' in named) {
      Object.assign(input, named['input']);
    }
    if ('context' in named) {
      Object.assign(context, named['context']);
    }

    let owner = getOwner(this);

    console.log({ input, context });
    let actor = createActor(machine, {
      input,
      context,
    });

    let state = new ReactiveActor(actor, owner);

    associateDestroyableChild(actor, this);

    state.start();

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
    state.handleUpdate(args);
  }

  destroyComponent(state) {
    if (isDestroying(state)) {
      return;
    }

    state.stop();

    destroy(state);
  }

  getContext(state) {
    return state;
  }
}
