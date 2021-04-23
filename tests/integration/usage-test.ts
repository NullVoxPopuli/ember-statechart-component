/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { setComponentTemplate } from '@ember/component';
import { clearRender, render } from '@ember/test-helpers';
import click from '@ember/test-helpers/dom/click';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { assign, createMachine } from 'xstate';

import type { State } from 'xstate';

module('Usage', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    let toggle = setComponentTemplate(
      hbs`
        {{yield this.state this.send}}
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

  test('can pass config', async function (assert) {
    let toggle = setComponentTemplate(
      hbs`
        {{yield this.state this.send}}
      `,
      createMachine({
        initial: 'inactive',
        states: {
          inactive: { entry: 'increment', on: { TOGGLE: 'active' } },
          active: { entry: 'increment', on: { TOGGLE: 'inactive' } },
        },
      })
    );

    this.owner.register('component:toggle-machine', toggle);

    let numCalled = 0;

    this.setProperties({
      config: {
        actions: {
          increment: () => numCalled++,
        },
      },
    });

    await render(hbs`
      <ToggleMachine @config={{this.config}} as |state send|>
        <button type='button' {{on 'click' (fn send 'TOGGLE')}}>
          Toggle
        </button>
      </ToggleMachine>
    `);

    assert.equal(numCalled, 1);

    await click('button');
    assert.equal(numCalled, 2);

    await click('button');
    assert.equal(numCalled, 3);
  });

  test('can pass context', async function (assert) {
    let toggle = setComponentTemplate(
      hbs`
        {{yield this.state this.send}}
      `,
      createMachine({
        initial: 'inactive',
        context: {
          numCalled: 0,
        },
        states: {
          inactive: {
            entry: assign({
              numCalled: (ctx: any) => ctx.numCalled + 1,
            }),
            on: { TOGGLE: 'active' },
          },
          active: {
            entry: assign({
              numCalled: (ctx: any) => ctx.numCalled + 1,
            }),
            on: { TOGGLE: 'inactive' },
          },
        },
      })
    );

    this.owner.register('component:toggle-machine', toggle);

    let context: any;

    this.setProperties({
      context: {
        numCalled: 10,
      },
      report: (data: any) => (context = data),
    });

    await render(hbs`
      <ToggleMachine @context={{this.context}} as |state send|>
        {{this.report state.context}}

        <button type='button' {{on 'click' (fn send 'TOGGLE')}}>
          Toggle
        </button>
      </ToggleMachine>
    `);

    assert.equal(context.numCalled, 11);

    await click('button');
    assert.equal(context.numCalled, 12);

    await click('button');
    assert.equal(context.numCalled, 13);
  });

  test('can pass initial state', async function (assert) {
    let toggle = setComponentTemplate(
      hbs`
        {{yield this.state this.send}}
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

    let previousState: State<unknown> | null = null;

    this.setProperties({
      record: (state: State<unknown>) => (previousState = state),
    });

    await render(hbs`
      <ToggleMachine as |state send|>
        {{state.value}}
        {{this.record state}}

        <button type='button' {{on 'click' (fn send 'TOGGLE')}}>
          Toggle
        </button>
      </ToggleMachine>
    `);

    assert.dom().containsText('inactive');

    await click('button');

    assert.dom().doesNotContainText('inactive');
    assert.dom().containsText('active');

    assert.ok(previousState, 'previous state has been captured');

    await clearRender();

    assert.dom().hasNoText('component unmounted');

    this.setProperties({ previousState });

    await render(hbs`
      <ToggleMachine @state={{this.previousState}} as |state send|>
        {{state.value}}
        {{this.record state}}

        <button type='button' {{on 'click' (fn send 'TOGGLE')}}>
          Toggle
        </button>
      </ToggleMachine>
    `);

    assert.dom().doesNotContainText('inactive');
    assert.dom().containsText('active');

    await click('button');

    assert.dom().containsText('inactive');
  });
});
