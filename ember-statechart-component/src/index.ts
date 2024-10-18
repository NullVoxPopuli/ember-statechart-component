import './registration.js';

import { assert } from '@ember/debug';
import { getOwner } from '@ember/owner';

import type { Registry } from '@ember/service';
import type { Actor, AnyActorLogic, SnapshotFrom } from 'xstate';

export { UPDATE_EVENT_NAME } from './-private/statechart-manager.js';

export function getService<Key extends keyof Registry>(
  context: unknown,
  serviceName: Key
): Registry[Key] {
  let owner = getOwner(context as object);

  assert(`Expected passed context to be aware of the container (owner)`, owner);

  let service = owner.lookup(`service:${serviceName}`) as Registry[Key];

  return service;
}

export interface ReactiveActor<Logic extends AnyActorLogic> {
  actor: Actor<Logic>;
  snapshot: SnapshotFrom<Logic>;
  value: SnapshotFrom<Logic>['value'];
  statePath: string;
  matches: SnapshotFrom<Logic>['matches'];
  send: (eventType: string) => void;
  onTransition: (callback: () => void) => void;
}
