import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { fn } from '@ember/helper';
import * as em from 'ember-modifier';

import { createMachine } from 'xstate';

module('Modifiers', function (hooks) {
  setupRenderingTest(hooks);

  test('a modifier can trigger an update to a machine', async function (assert) {
    const customModifier = em.modifier((_element: Element, [toggle]: [() => void]) => { toggle(); });

    const ToggleMachine = createMachine({
      initial: 'inactive',
      states: {
        inactive: { on: { TOGGLE: 'active' } },
        active: { on: { TOGGLE: 'inactive' } },
      },
    });

    await render(
      <template>
        <ToggleMachine as |machine|>
          {{machine.statePath}}

          <button {{customModifier (fn machine.send 'TOGGLE')}} type='button'>
            Toggle
          </button>
        </ToggleMachine>
      </template>
    );

    assert.dom().doesNotContainText('inactive');
    assert.dom().containsText('active');
  });
});
