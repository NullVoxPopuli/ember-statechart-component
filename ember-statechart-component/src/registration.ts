import { setComponentManager, setComponentTemplate } from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';

import { StateNode } from 'xstate';

import ComponentManager from './-private/statechart-manager';

// Managers are managed globally, and not per app instance
setComponentManager((owner) => ComponentManager.create(owner), StateNode.prototype);
setComponentTemplate(hbs`{{yield this.state this.send this.onTransition}}`, StateNode.prototype);

export function initialize(): void {
  /* intentionally empty */
}

export default {
  initialize,
};
