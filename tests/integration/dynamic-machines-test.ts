/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { assign, createMachine, spawn } from 'xstate';

import type { Interpreter } from 'xstate';

type Send = Interpreter<unknown>['send'];

module('Dynamic Machines', function (hooks) {
  setupRenderingTest(hooks);

  test('Can have a dynamically created machine and is reactive', async function (assert) {
    function createNested(context: Record<string, unknown>, config: any = {}) {
      return createMachine({
        id: 'nested',
        initial: 'inactive',

        context: {
          inactive: 0,
          active: 0,
          ...context,
        },

        states: {
          inactive: {
            entry: ['incrementInactive'],
            on: { TOGGLE: 'active' },
          },
          active: {
            entry: ['incrementActive'],
            on: { TOGGLE: 'inactive' },
          },
        },
      }).withConfig(config);
    }

    const parentMachine = createMachine({
      id: 'parent',
      initial: 'idle',

      states: {
        idle: {
          on: {
            SPAWN: 'spawnNested',
          },
        },
        spawnNested: {
          entry: assign({
            someRef: (_context, { nested, id }: any) => {
              return spawn(nested, id);
            },
          }),
        },
      },
    });

    this.owner.register('component:test-machine', parentMachine);

    let active = 0;
    let inactive = 0;

    this.setProperties({
      startNested: (send: Send) =>
        send('SPAWN', {
          id: 'named-spawned-machine',
          nested: createNested(
            { active: 3 },
            {
              actions: {
                incrementActive: () => active++,
                incrementInactive: () => inactive++,
              },
            }
          ),
        }),
    });

    await render(hbs`
        <TestMachine as |state send|>
          {{state.toStrings}}

          <button id='spawn' {{on 'click' (fn this.startNested send)}}>Spawn Nested Machine</button>

          {{#if state.context.someRef}}
            {{!--
              someRef.state does not have a reactive wrapper, like the root interpreter does

              TODO: make this reactive
            --}}
            {{state.context.someRef.state.value}}

            <button id='toggle' {{on 'click' (fn state.context.someRef.send  'TOGGLE')}}>Toggle</button>
          {{/if}}

        </TestMachine>
      `);

    assert.dom().containsText('idle');
    assert.equal(active, 0);
    assert.equal(inactive, 0);

    await click('#spawn');
    assert.equal(active, 0);
    assert.equal(inactive, 1);

    assert.dom().containsText('spawnNested');

    /**
     * There is not a way to easily access spawned machines
     * internal state, so we've wired up some actions / callbacks
     */
    await click('#toggle');

    assert.equal(active, 1);
    assert.equal(inactive, 1);

    await click('#toggle');

    assert.equal(active, 1);
    assert.equal(inactive, 2);
  });
});
