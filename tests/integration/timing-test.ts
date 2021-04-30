/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { createMachine } from 'xstate';

declare module '@ember/service' {
  interface Registry {
    'test-state': any; // determined in tests
  }
}

module('Timing', function (hooks) {
  setupRenderingTest(hooks);

  module('Infinite (Re|In)validation messaging', function () {
    test('Can have an initial state with invoke', async function (assert) {
      let machine = createMachine({
        initial: 'waiting',
        states: {
          stateA: {},
          waiting: {
            invoke: {
              src: () => (send) => {
                send('IMPLICTLY_NEXT');
              },
              onDone: {},
              onError: {},
            },
            on: {
              IMPLICTLY_NEXT: 'stateA',
            },
          },
        },
      });

      this.owner.register('component:test-machine', machine);

      await render(hbs`
        <TestMachine as |state|>
          {{state.value}}
        </TestMachine>
      `);

      assert.dom().containsText('stateA');
    });
  });
});
