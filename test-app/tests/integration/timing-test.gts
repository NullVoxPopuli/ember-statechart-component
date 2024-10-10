/* eslint-disable @typescript-eslint/no-explicit-any */

import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { setup, fromPromise } from 'xstate';

declare module '@ember/service' {
  interface Registry {
    'test-state': any; // determined in tests
  }
}

module('Timing', function (hooks) {
  setupRenderingTest(hooks);

  module('Infinite (Re|In)validation messaging', function () {
    test('Can have an initial state with invoke', async function (assert) {
      const machine = setup({
        actors: {
          goNext: fromPromise(({ emit}) => {
            emit('IMPLICTLY_NEXT');
          })
        },
      }).createMachine({
        initial: 'waiting',
        states: {
          stateA: {},
          waiting: {
            invoke: {
              src: 'goNext',
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

      await render(<template>
        <machine as |state|>
          {{state.value}}
        </machine>
      </template>);

      assert.dom().containsText('stateA');
    });
  });
});
