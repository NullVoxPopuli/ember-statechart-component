/* eslint-disable @typescript-eslint/no-explicit-any */

import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import Service from '@ember/service';
import { clearRender, render } from '@ember/test-helpers';
import click from '@ember/test-helpers/dom/click';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import { getService } from 'ember-statechart-component';
import { assign, createMachine } from 'xstate';

declare module '@ember/service' {
  interface Registry {
    'test-state': {
      foo: number;
      }; // determined in tests
  }
}

// Pending fix in glimmer-vm
// state.matches *should* just work
// @ts-expect-error todo: don't use call at all
// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
const call = (obj, fun, ...args) => fun.call(obj, ...args);

/**
 * any casting will be fixed when tests can be gts
 */
module('Usage', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    const Toggle = createMachine({
      initial: 'inactive',
      states: {
        inactive: { on: { TOGGLE: 'active' } },
        active: { on: { TOGGLE: 'inactive' } },
      },
    });

  console.log(Toggle.__has_been_declaration_merged_from_ember_statechart_component__)

    await render(
      <template>
        <Toggle as |snapshot actor|>
          {{snapshot.value}}

          <button type="button" {{on "click" (fn actor.send "TOGGLE")}}>
            Toggle
          </button>
        </Toggle>
      </template>
    );

    assert.dom().containsText('inactive');

    await click('button');

    assert.dom().doesNotContainText('inactive');
    assert.dom().containsText('active');
  });

  test('can use services', async function (assert) {
    const Toggle = createMachine(
      {
        initial: 'inactive',
        states: {
          inactive: { entry: 'increment', on: { TOGGLE: 'active' } },
          active: { entry: 'increment', on: { TOGGLE: 'inactive' } },
        },
      },
      {
        actions: {
          increment: ({ context }) => {
            getService(context, 'test-state').foo++;
          },
        },
      }
    );

    this.owner.register(
      'service:test-state',
      class TestState extends Service {
        foo = 0;
      }
    );

    await render(
      <template>
        <Toggle as |state send|>
          {{state.value}}

          <button type="button" {{on "click" (fn send "TOGGLE")}}>
            Toggle
          </button>
        </Toggle>
      </template>
    );

    const testState = this.owner.lookup('service:test-state') as { foo: number };

    assert.strictEqual(testState.foo, 1);

    await click('button');
    assert.strictEqual(testState.foo, 2);

    await click('button');
    assert.strictEqual(testState.foo, 3);
  });

  test(`it can use XState's builtin matches function`, async function (assert) {
    const Toggle = createMachine({
      initial: 'inactive',
      states: {
        inactive: { on: { TOGGLE: 'active' } },
        active: { on: { TOGGLE: 'inactive' } },
      },
    });

    await render(
      <template>
        <Toggle as |state send|>
          {{#if (call state state.matches "inactive")}}
            The inactive state
          {{else if (call state state.matches "active")}}
            The active state
          {{else}}
            Unknown state
          {{/if}}

          <button type="button" {{on "click" (fn send "TOGGLE")}}>
            Toggle
          </button>
        </Toggle>
      </template>
    );

    assert.dom().containsText('The inactive state');

    await click('button');

    assert.dom().containsText('The active state');
  });

  test('multiple invocations have their own state', async function (assert) {
    const Toggle = createMachine({
      initial: 'inactive',
      states: {
        inactive: { on: { TOGGLE: 'active' } },
        active: { on: { TOGGLE: 'inactive' } },
      },
    });

    await render(
      <template>
        <div id="one">
          <Toggle as |state send|>
            {{state.value}}

            <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
              Toggle
            </button>
          </Toggle>
        </div>
        <div id="two">
          <Toggle as |state send|>
            {{state.value}}

            <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
              Toggle
            </button>
          </Toggle>
        </div>
      </template>
    );

    assert.dom('#one').containsText('inactive');
    assert.dom('#two').containsText('inactive');

    await click('#one button');

    assert.dom('#one').doesNotContainText('inactive');
    assert.dom('#one').containsText('active');
    assert.dom('#two').containsText('inactive');
  });

  test('can pass config', async function (assert) {
    const Toggle = createMachine({
      initial: 'inactive',
      states: {
        inactive: { entry: 'increment', on: { TOGGLE: 'active' } },
        active: { entry: 'increment', on: { TOGGLE: 'inactive' } },
      },
    });

    let numCalled = 0;

    const config = {
      actions: {
        increment: () => numCalled++,
      },
    };

    await render(
      <template>
        <Toggle @config={{config}} as |_state send|>
          <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
            Toggle
          </button>
        </Toggle>
      </template>
    );

    assert.strictEqual(numCalled, 1);

    await click('button');
    assert.strictEqual(numCalled, 2);

    await click('button');
    assert.strictEqual(numCalled, 3);
  });

  test('can pass context', async function (assert) {
    const Toggle = createMachine({
      initial: 'inactive',
      context: ({ input }) => {
        return {
          numCalled: input.numCalled ?? 0,
        }
      },
      states: {
        inactive: {
          entry: assign({
            numCalled: ({ context }) => context.numCalled + 1,
          }),
          on: { TOGGLE: 'active' },
        },
        active: {
          entry: assign({
            numCalled: ({ context }) => context.numCalled + 1,
          }),
          on: { TOGGLE: 'inactive' },
        },
      },
    });

    const input = {
      numCalled: 10,
    };

let context = { numCalled: null };

    const report = (data: any) => (context = data);

    await render(
      <template>
        <Toggle @input={{input}} as |state send|>
          {{report state.context}}

          <button type="button" {{on "click" (fn send "TOGGLE")}}>
            Toggle
          </button>
        </Toggle>
      </template>
    );

    assert.strictEqual(context.numCalled, 11);

    await click('button');
    assert.strictEqual(context.numCalled, 12);

    await click('button');
    assert.strictEqual(context.numCalled, 13);
  });

  test('merging passed context by default', async function (assert) {
    const Toggle = createMachine({
      initial: 'inactive',
      context: ({ input }) => Object.assign({ foo: 'foo' }, input),
      states: {
        inactive: { on: { TOGGLE: 'active' } },
        active: { on: { TOGGLE: 'inactive' } },
      },
    });

    const input = { bar: 'bar' };

    await render(
      <template>
        <Toggle @input={{input}} as |state|>
          {{state.context.foo}},
          {{state.context.bar}}
        </Toggle>
      </template>
    );

    assert.dom().containsText('foo, bar');
  });

  test('can pass initial state', async function (assert) {
    const Toggle = createMachine({
      initial: 'inactive',
      states: {
        inactive: { on: { TOGGLE: 'active' } },
        active: { on: { TOGGLE: 'inactive' } },
      },
    });

    let previousState: State<unknown> | null = null;

    const report = (state: State<unknown>) => (previousState = state);

    await render(
      <template>
        <Toggle as |state send|>
          {{state.value}}
          {{report state}}

          <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
            Toggle
          </button>
        </Toggle>
      </template>
    );

    assert.dom().containsText('inactive');

    await click('button');

    assert.dom().doesNotContainText('inactive');
    assert.dom().containsText('active');

    assert.ok(previousState, 'previous state has been captured');

    await clearRender();

    assert.dom().hasNoText('component unmounted');

    await render(
      <template>
        <Toggle @snapshot={{previousState}} as |state send|>
          {{state.value}}
          {{report state}}

          <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
            Toggle
          </button>
        </Toggle>
      </template>
    );

    assert.dom().doesNotContainText('inactive');
    assert.dom().containsText('active');

    await click('button');

    assert.dom().containsText('inactive');
  });

  test('can pass onTransition callback', async function (assert) {
    const Toggle = createMachine({
      initial: 'inactive',
      states: {
        inactive: { on: { TOGGLE: 'active' } },
        active: { on: { TOGGLE: 'inactive' } },
      },
    });

    assert.expect(2);

    const doSomething = (snapshot: { value: string }) => {
      assert.step(snapshot.value);
    };

    await render(
      <template>
        <Toggle as |_state send actor|>
          {{actor.onTransition doSomething}}
          {{send "TOGGLE"}}
        </Toggle>
      </template>
    );

  assert.verifySteps(['active'])
  });
});
