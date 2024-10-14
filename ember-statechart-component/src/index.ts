import './registration.js';

import { assert } from '@ember/debug';
import { getOwner } from '@ember/owner';

import type { Registry } from '@ember/service';

export function getService<Key extends keyof Registry>(
  context: unknown,
  serviceName: Key
): Registry[Key] {
  let owner = getOwner(context as object);

  assert(`Expected passed context to be aware of the container (owner)`, owner);

  let service = owner.lookup(`service:${serviceName}`) as Registry[Key];

  return service;
}
