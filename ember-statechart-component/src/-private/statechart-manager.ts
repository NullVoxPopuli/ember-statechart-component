/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { tracked } from '@glimmer/tracking';
import { getOwner, setOwner } from '@ember/application';
import { capabilities } from '@ember/component';
import { destroy, isDestroying } from '@ember/destroyable';

import { createActor, State } from 'xstate';

import type { Actor, StateMachine, StateNode } from 'xstate';

export interface Args {
  named: Record<string, unknown>;
  positional: unknown[];
}

const UPDATE_EVENT_NAME = 'UPDATE';

class ReactiveActor {
  @tracked lastSnapshot = null;

  #actor;
  #callbacks = [];

  get state() {
    return this.lastSnapshot || {};
  }

  constructor(actor) {
    this.#actor = actor;

    actor.subscribe((snapshot) => {
      console.log('setting snapshot', snapshot);
      this.lastSnapshot = snapshot;
      this.#callbacks.forEach((fn) => fn(snapshot));
    });
  }

  start = () => this.#actor.start();
  stop = () => this.#actor.stop();
  send = (...args) => this.#actor.send(...args);
  sendEvent = (type, ...extra) => this.#actor.send({ type, ...extra });

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

  static create(owner: any) {
    let manager = new ComponentManager();

    setOwner(manager, owner);

    return manager;
  }

  createComponent(machine: StateMachine, args: Args) {
    let { named } = args;

    if ('config' in named) {
      machine = machine.provide(named['config'] as any);
    }

    let context = {};

    if ('context' in named) {
      Object.assign(context, named['context']);
    }

    setOwner(context, getOwner(this) as any);

    let actor = createActor(machine, {
      input: context,
    });

    let state = new ReactiveActor(actor);
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
  updateComponent(state: ReactiveActor, args: Args) {
    state.handleUpdate(args);
  }

  destroyComponent(state: ReactiveActor) {
    if (isDestroying(state)) {
      return;
    }

    state.stop();

    destroy(state);
  }

  getContext(state: ReactiveActor) {
    return state;
  }
}
