import { setComponentManager } from '@ember/component';

import ComponentManager from 'ember-statechart-component/-private/statechart-manager';
import { StateNode } from 'xstate';

import type ApplicationInstance from '@ember/application/instance';

export function initialize(): void {
  setComponentManager(
    (owner: ApplicationInstance) => {
      return ComponentManager.create(owner);
    } /* hmm, it seems XState creates a totally new object here, so we have no prototype or superclass to checkt */,
    StateNode.prototype
  );
}

export default {
  initialize,
};
