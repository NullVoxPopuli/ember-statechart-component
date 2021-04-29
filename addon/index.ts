import { getOwner } from '@ember/application';
import { setComponentManager, setComponentTemplate } from '@ember/component';
import { assert } from '@ember/debug';
import { hbs } from 'ember-cli-htmlbars';

import ComponentManager from 'ember-statechart-component/-private/statechart-manager';
import { StateNode } from 'xstate';

import type { Registry } from '@ember/service';

export function getService<Key extends keyof Registry>(context: unknown, serviceName: Key) {
  let owner = getOwner(context);

  assert(`Expected passed context to be aware of the container (owner)`, owner);

  let service = owner.lookup(`service:${serviceName}`) as Registry[Key];

  return service;
}

// Managers are managed globally, and not per app instance
setComponentManager((owner) => ComponentManager.create(owner), StateNode.prototype);
setComponentTemplate(hbs`{{yield this.state this.send}}`, StateNode.prototype);

export function setup() {
  // placebo!
  return null;
}
