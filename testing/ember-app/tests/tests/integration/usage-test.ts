/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Service from '@ember/service';
import { clearRender, render } from '@ember/test-helpers';
import click from '@ember/test-helpers/dom/click';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { getService } from 'ember-statechart-component';
import { assign, createMachine } from 'xstate';

import type { State } from 'xstate';

declare module '@ember/service' {
  interface Registry {
    'test-state': any; // determined in tests
  }
}

module('Usage', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
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

  test('can use services', async function (assert) {
    let toggle = createMachine(
      {
        initial: 'inactive',
        states: {
          inactive: { entry: 'increment', on: { TOGGLE: 'active' } },
          active: { entry: 'increment', on: { TOGGLE: 'inactive' } },
        },
      },
      {
        actions: {
          increment: (ctx) => {
            getService(ctx, 'test-state').foo++;
          },
        },
      }
    );

    this.owner.register('component:toggle-machine', toggle);
    this.owner.register(
      'service:test-state',
      class TestState extends Service {
        foo = 0;
      }
    );

    await render(hbs`
      <ToggleMachine as |state send|>
        {{state.value}}

        <button type='button' {{on 'click' (fn send 'TOGGLE')}}>
          Toggle
        </button>
      </ToggleMachine>
    `);

    let testState = this.owner.lookup('service:test-state');

    assert.strictEqual(testState.foo, 1);

    await click('button');
    assert.strictEqual(testState.foo, 2);

    await click('button');
    assert.strictEqual(testState.foo, 3);
  });

  test(`it can use XState's builtin matches function`, async function (assert) {
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
        {{#if (state.matches 'inactive')}}
          The inactive state
        {{else if (state.matches 'active')}}
          The active state
        {{else}}
          Unknown state
        {{/if}}

        <button type='button' {{on 'click' (fn send 'TOGGLE')}}>
          Toggle
        </button>
      </ToggleMachine>
    `);

    assert.dom().containsText('The inactive state');

    await click('button');

    assert.dom().containsText('The active state');
  });

  test('multiple invocations have their own state', async function (assert) {
    let toggle = createMachine({
      initial: 'inactive',
      states: {
        inactive: { on: { TOGGLE: 'active' } },
        active: { on: { TOGGLE: 'inactive' } },
      },
    });

    this.owner.register('component:toggle-machine', toggle);

    await render(hbs`
      <div id="one">
        <ToggleMachine as |state send|>
          {{state.value}}

          <button type='button' {{on 'click' (fn send 'TOGGLE')}}>
            Toggle
          </button>
        </ToggleMachine>
      </div>
      <div id="two">
        <ToggleMachine as |state send|>
          {{state.value}}

          <button type='button' {{on 'click' (fn send 'TOGGLE')}}>
            Toggle
          </button>
        </ToggleMachine>
      </div>
    `);

    assert.dom('#one').containsText('inactive');
    assert.dom('#two').containsText('inactive');

    await click('#one button');

    assert.dom('#one').doesNotContainText('inactive');
    assert.dom('#one').containsText('active');
    assert.dom('#two').containsText('inactive');
  });

  test('can pass config', async function (assert) {
    let toggle = createMachine({
      initial: 'inactive',
      states: {
        inactive: { entry: 'increment', on: { TOGGLE: 'active' } },
        active: { entry: 'increment', on: { TOGGLE: 'inactive' } },
      },
    });

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

    assert.strictEqual(numCalled, 1);

    await click('button');
    assert.strictEqual(numCalled, 2);

    await click('button');
    assert.strictEqual(numCalled, 3);
  });

  test('can pass context', async function (assert) {
    let toggle = createMachine({
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
    });

    this.owner.register('component:toggle-machine', toggle);

    let context: any;

    this.setProperties({
      context: {
        numCalled: 10,
      },
    });

    this.owner.register('helper:report', (data: any) => (context = data));

    await render(hbs`
      <ToggleMachine @context={{this.context}} as |state send|>
        {{report state.context}}

        <button type='button' {{on 'click' (fn send 'TOGGLE')}}>
          Toggle
        </button>
      </ToggleMachine>
    `);

    assert.strictEqual(context.numCalled, 11);

    await click('button');
    assert.strictEqual(context.numCalled, 12);

    await click('button');
    assert.strictEqual(context.numCalled, 13);
  });

  test('merging passed context by default', async function (assert) {
    let toggle = createMachine({
      initial: 'inactive',
      context: { foo: 'foo' },
      states: {
        inactive: { on: { TOGGLE: 'active' } },
        active: { on: { TOGGLE: 'inactive' } },
      },
    });

    this.setProperties({ toggle, context: { bar: 'bar' } });

    await render(hbs`
      <this.toggle @context={{this.context}} as |state send|>
        {{state.context.foo}}, {{state.context.bar}}
      </this.toggle>
    `);

    assert.dom().containsText('foo, bar');
  });

  test('can pass initial state', async function (assert) {
    let toggle = createMachine({
      initial: 'inactive',
      states: {
        inactive: { on: { TOGGLE: 'active' } },
        active: { on: { TOGGLE: 'inactive' } },
      },
    });

    let previousState: State<unknown> | null = null;

    this.owner.register('component:toggle-machine', toggle);
    this.owner.register('helper:report', (state: State<unknown>) => (previousState = state));

    await render(hbs`
      <ToggleMachine as |state send|>
        {{state.value}}
        {{report state}}

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
        {{report state}}

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
