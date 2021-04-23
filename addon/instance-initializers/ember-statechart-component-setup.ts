import { setComponentManager, setComponentTemplate } from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';

import ComponentManager from 'ember-statechart-component/-private/statechart-manager';
import { StateNode } from 'xstate';

// Managers are managed globally, and not per app instance
setComponentManager((owner) => ComponentManager.create(owner), StateNode.prototype);
setComponentTemplate(hbs`{{yield this.state this.send}}`, StateNode.prototype);

export function initialize(): void {
  /* intentionally empty */
}

export default {
  initialize,
};
