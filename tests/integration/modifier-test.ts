/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { modifier } from 'ember-could-get-used-to-this';
import { createMachine } from 'xstate';

declare module '@ember/service' {
  interface Registry {
    'test-state': any; // determined in tests
  }
}

module('Modifiers', function (hooks) {
  setupRenderingTest(hooks);

  test('a modifier can trigger an update to a machine', async function (assert) {
    this.setProperties({
      customModifier: modifier((_element: Element, toggle: () => void) => toggle()),
    });
    let toggle = createMachine({
      initial: 'inactive',
      states: {
        inactive: { on: { TOGGLE: 'active' } },
        active: { on: { TOGGLE: 'inactive' } },
      },
    });

    this.owner.register('component:toggle-machine', toggle);

    await render(hbs`
      <ToggleMachine as |state send|>
        {{state.value}}

        <button {{this.customModifier (fn send 'TOGGLE')}} type='button'>
          Toggle
        </button>
      </ToggleMachine>
    `);

    assert.dom().doesNotContainText('inactive');
    assert.dom().containsText('active');
  });
});
