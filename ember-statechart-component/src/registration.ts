import { setComponentManager, setComponentTemplate } from '@ember/component';
import { precompileTemplate } from '@ember/template-compilation';

import { StateMachine } from 'xstate';

import ComponentManager from './-private/statechart-manager.js';

let isSetup = false;

/**
 * Installs StateNode detection for Ember.
 * This is what allows Ember to render createMachine() values as components.
 *
 * Optionally, if, for whatever reason, there is a risk of multiple XState's
 * in the dependency graph (like with linking dependencies), an `override` may
 * be passed to choose a specific XState (hopefully from the host app).
 */
export function setupComponentMachines(override?: typeof StateMachine) {
  if (isSetup) return;

  // Managers are managed globally, and not per app instance
  setComponentManager(
    (owner) => ComponentManager.create(owner),
    override?.prototype || StateMachine.prototype
  );

  setComponentTemplate(
    precompileTemplate(`{{yield this.state this.send this.onTransition}}`, {
      strictMode: true,
    }),
    override?.prototype || StateMachine.prototype
  );

  isSetup = true;
}

// ‼️ SideEffect
setupComponentMachines();
