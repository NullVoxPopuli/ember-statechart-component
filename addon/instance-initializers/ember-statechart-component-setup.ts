import { setComponentManager } from '@ember/component';

import ComponentManager from 'ember-statechart-component/-private/statechart-manager';
import { StateNode } from 'xstate';

// Managers are managed globally, and not per app instance
setComponentManager((owner) => ComponentManager.create(owner), StateNode.prototype);

export function initialize(): void {}

export default {
  initialize,
};
