import { setComponentManager, setComponentTemplate } from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';

import { StateNode } from 'xstate';

import ComponentManager from './-private/statechart-manager';

let isSetup = false;

export function setupComponentMachines() {
  if (isSetup) return;

  // Managers are managed globally, and not per app instance
  setComponentManager((owner) => ComponentManager.create(owner), StateNode.prototype);
  setComponentTemplate(hbs`{{yield this.state this.send this.onTransition}}`, StateNode.prototype);

  isSetup = true;
}
