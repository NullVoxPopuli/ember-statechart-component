import { setComponentManager } from '@ember/component';

import ComponentManager from 'ember-statechart-component/-private/statechart-manager';
import { StateNode } from 'xstate';

// Managers are managed globally, and not per app instance
let registered = false;

export function initialize(): void {
  if (registered) return;

  setComponentManager((owner) => ComponentManager.create(owner), StateNode.prototype);

  registered = true;
}

export default {
  initialize,
};
