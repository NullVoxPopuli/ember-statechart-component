import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

function getService(context, serviceName) {
  let owner = getOwner(context);
  assert(`Expected passed context to be aware of the container (owner)`, owner);
  let service = owner.lookup(`service:${serviceName}`);
  return service;
}

export { getService };
