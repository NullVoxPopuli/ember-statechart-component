/* eslint-disable @typescript-eslint/no-unused-vars */
import { setComponentTemplate } from '@ember/component';
import { render } from '@ember/test-helpers';
import click from '@ember/test-helpers/dom/click';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { createMachine } from 'xstate';

module('Usage', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    let toggle = setComponentTemplate(
      hbs`
        {{yield this._state this.send}}
      `,
      createMachine({
        initial: 'inactive',
        states: {
          inactive: { on: { TOGGLE: 'active' } },
          active: { on: { TOGGLE: 'inactive' } },
        },
      })
    );

    this.owner.register('component:toggle-machine', toggle);

    await render(hbs`
      <ToggleMachine as |state send|>
        {{state.value}}

        <button type='button' {{on 'click' (fn send 'TOGGLE')}}>
          Toggle
        </button>
      </ToggleMachine>
    `);

    assert.dom().containsText('inactive');

    await click('button');

    assert.dom().doesNotContainText('inactive');
    assert.dom().containsText('active');
  });
});
