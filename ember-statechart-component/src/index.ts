import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

import type ApplicationInstance from '@ember/application/instance';
import type { Registry } from '@ember/service';

export function getService<Key extends keyof Registry>(context: unknown, serviceName: Key) {
  let owner = getOwner(context) as ApplicationInstance;

  assert(`Expected passed context to be aware of the container (owner)`, owner);

  let service = owner.lookup(`service:${serviceName}`) as Registry[Key];

  return service;
}
