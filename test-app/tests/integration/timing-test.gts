import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { fromCallback, createMachine, sendTo } from 'xstate';

module('Timing', function (hooks) {
  setupRenderingTest(hooks);

  module('Infinite (Re|In)validation messaging', function () {
    test('Can have an initial state with invoke', async function (assert) {
      const Machine = createMachine({
        initial: 'waiting',
        states: {
          stateA: {},
          waiting: {
            invoke: {
              id: 'transition-away-immediately',
              src: fromCallback(({ sendBack }) => {
                sendBack({ type: 'IMPLICTLY_NEXT' });
              }),
              input: ({ self }) => ({ parent: self }),
              onDone: {},
              onError: {},
            },
            entry: sendTo('transition-away-immediately', ({ self }) => ({
              sender: self,
            })),
            on: {
              IMPLICTLY_NEXT: 'stateA',
            },
          },
        },
      });

      await render(
        <template>
          <Machine as |state|>
            {{state.value}}
          </Machine>
        </template>
      );

      assert.dom().containsText('stateA');
    });
  });
});
