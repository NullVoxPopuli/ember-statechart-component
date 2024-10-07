// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { fn } from '@ember/helper';
// import { on } from '@ember/modifier';
// import Service from '@ember/service';
// import { clearRender, render } from '@ember/test-helpers';
// import click from '@ember/test-helpers/dom/click';
// import { module, test } from 'qunit';
// import { setupRenderingTest } from 'ember-qunit';

// import toAny from 'ember-app/helpers/to-any';
// import toString from 'ember-app/helpers/to-string';
// import { getService } from 'ember-statechart-component';
// import { assign, createMachine } from 'xstate';

// import type { State } from 'xstate';

// declare module '@ember/service' {
//   interface Registry {
//     'test-state': any; // determined in tests
//   }
// }

// /**
//  * any casting will be fixed when tests can be gts
//  */
// module('Usage', function (hooks) {
//   setupRenderingTest(hooks);

//   test('it works', async function (assert) {
//     let Toggle = createMachine({
//       initial: 'inactive',
//       states: {
//         inactive: { on: { TOGGLE: 'active' } },
//         active: { on: { TOGGLE: 'inactive' } },
//       },
//     });

//     await render(
//       <template>
//         <Toggle as |state send|>
//           {{toString state.value}}

//           <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
//             Toggle
//           </button>
//         </Toggle>
//       </template>
//     );

//     await this.pauseTest();
//     assert.dom().containsText('inactive');

//     await click('button');

//     assert.dom().doesNotContainText('inactive');
//     assert.dom().containsText('active');
//   });

//   test('can use services', async function (assert) {
//     let Toggle = createMachine(
//       {
//         initial: 'inactive',
//         states: {
//           inactive: { entry: 'increment', on: { TOGGLE: 'active' } },
//           active: { entry: 'increment', on: { TOGGLE: 'inactive' } },
//         },
//       },
//       {
//         actions: {
//           increment: (ctx) => {
//             getService(ctx, 'test-state').foo++;
//           },
//         },
//       }
//     );

//     this.owner.register(
//       'service:test-state',
//       class TestState extends Service {
//         foo = 0;
//       }
//     );

//     await render(
//       <template>
//         <Toggle as |state send|>
//           {{toString state.value}}

//           <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
//             Toggle
//           </button>
//         </Toggle>
//       </template>
//     );

//     let testState = this.owner.lookup('service:test-state') as { foo: number };

//     assert.strictEqual(testState.foo, 1);

//     await click('button');
//     assert.strictEqual(testState.foo, 2);

//     await click('button');
//     assert.strictEqual(testState.foo, 3);
//   });

//   test(`it can use XState's builtin matches function`, async function (assert) {
//     let Toggle = createMachine({
//       initial: 'inactive',
//       states: {
//         inactive: { on: { TOGGLE: 'active' } },
//         active: { on: { TOGGLE: 'inactive' } },
//       },
//     });

//     await render(
//       <template>
//         <Toggle as |state send|>
//           {{#let (toAny state "matches") as |typelessMatches|}}
//             {{#if (typelessMatches "inactive")}}
//               The inactive state
//             {{else if (typelessMatches "active")}}
//               The active state
//             {{else}}
//               Unknown state
//             {{/if}}
//           {{/let}}

//           <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
//             Toggle
//           </button>
//         </Toggle>
//       </template>
//     );

//     assert.dom().containsText('The inactive state');

//     await click('button');

//     assert.dom().containsText('The active state');
//   });

//   test('multiple invocations have their own state', async function (assert) {
//     let Toggle = createMachine({
//       initial: 'inactive',
//       states: {
//         inactive: { on: { TOGGLE: 'active' } },
//         active: { on: { TOGGLE: 'inactive' } },
//       },
//     });

//     await render(
//       <template>
//         <div id="one">
//           <Toggle as |state send|>
//             {{toString state.value}}

//             <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
//               Toggle
//             </button>
//           </Toggle>
//         </div>
//         <div id="two">
//           <Toggle as |state send|>
//             {{toString state.value}}

//             <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
//               Toggle
//             </button>
//           </Toggle>
//         </div>
//       </template>
//     );

//     assert.dom('#one').containsText('inactive');
//     assert.dom('#two').containsText('inactive');

//     await click('#one button');

//     assert.dom('#one').doesNotContainText('inactive');
//     assert.dom('#one').containsText('active');
//     assert.dom('#two').containsText('inactive');
//   });

//   test('can pass config', async function (assert) {
//     let Toggle = createMachine({
//       initial: 'inactive',
//       states: {
//         inactive: { entry: 'increment', on: { TOGGLE: 'active' } },
//         active: { entry: 'increment', on: { TOGGLE: 'inactive' } },
//       },
//     });

//     let numCalled = 0;

//     let config = {
//       actions: {
//         increment: () => numCalled++,
//       },
//     };

//     await render(
//       <template>
//         <Toggle @config={{config}} as |_state send|>
//           <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
//             Toggle
//           </button>
//         </Toggle>
//       </template>
//     );

//     assert.strictEqual(numCalled, 1);

//     await click('button');
//     assert.strictEqual(numCalled, 2);

//     await click('button');
//     assert.strictEqual(numCalled, 3);
//   });

//   test('can pass context', async function (assert) {
//     let Toggle = createMachine({
//       initial: 'inactive',
//       context: {
//         numCalled: 0,
//       },
//       states: {
//         inactive: {
//           entry: assign({
//             numCalled: (ctx: any) => ctx.numCalled + 1,
//           }),
//           on: { TOGGLE: 'active' },
//         },
//         active: {
//           entry: assign({
//             numCalled: (ctx: any) => ctx.numCalled + 1,
//           }),
//           on: { TOGGLE: 'inactive' },
//         },
//       },
//     });

//     let context = {
//       numCalled: 10,
//     };

//     const report = (data: any) => (context = data);

//     await render(
//       <template>
//         <Toggle @context={{context}} as |state send|>
//           {{report state.context}}

//           <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
//             Toggle
//           </button>
//         </Toggle>
//       </template>
//     );

//     assert.strictEqual(context.numCalled, 11);

//     await click('button');
//     assert.strictEqual(context.numCalled, 12);

//     await click('button');
//     assert.strictEqual(context.numCalled, 13);
//   });

//   test('merging passed context by default', async function (assert) {
//     let Toggle = createMachine({
//       initial: 'inactive',
//       context: { foo: 'foo' },
//       states: {
//         inactive: { on: { TOGGLE: 'active' } },
//         active: { on: { TOGGLE: 'inactive' } },
//       },
//     });

//     let context = { bar: 'bar' };

//     await render(
//       <template>
//         <Toggle @context={{context}} as |state|>
//           {{state.context.foo}},
//           {{state.context.bar}}
//         </Toggle>
//       </template>
//     );

//     assert.dom().containsText('foo, bar');
//   });

//   test('can pass initial state', async function (assert) {
//     let Toggle = createMachine({
//       initial: 'inactive',
//       states: {
//         inactive: { on: { TOGGLE: 'active' } },
//         active: { on: { TOGGLE: 'inactive' } },
//       },
//     });

//     let previousState: State<unknown> | null = null;

//     const report = (state: State<unknown>) => (previousState = state);

//     await render(
//       <template>
//         <Toggle as |state send|>
//           {{toString state.value}}
//           {{report state}}

//           <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
//             Toggle
//           </button>
//         </Toggle>
//       </template>
//     );

//     assert.dom().containsText('inactive');

//     await click('button');

//     assert.dom().doesNotContainText('inactive');
//     assert.dom().containsText('active');

//     assert.ok(previousState, 'previous state has been captured');

//     await clearRender();

//     assert.dom().hasNoText('component unmounted');

//     await render(
//       <template>
//         <Toggle @state={{previousState}} as |state send|>
//           {{toString state.value}}
//           {{report state}}

//           <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
//             Toggle
//           </button>
//         </Toggle>
//       </template>
//     );

//     assert.dom().doesNotContainText('inactive');
//     assert.dom().containsText('active');

//     await click('button');

//     assert.dom().containsText('inactive');
//   });

//   // eslint-disable-next-line qunit/require-expect
//   test('can pass onTransition callback', async function (assert) {
//     let Toggle = createMachine({
//       initial: 'inactive',
//       states: {
//         inactive: { on: { TOGGLE: 'active' } },
//         active: { on: { TOGGLE: 'inactive' } },
//       },
//     });

//     assert.expect(2);

//     const doSomething = (state: { value: string }, event: { type: string }) => {
//       assert.strictEqual(state.value, event.type === 'xstate.init' ? 'inactive' : 'active');
//     };

//     await render(
//       <template>
//         <Toggle as |_state send onTransition|>
//           {{onTransition doSomething}}
//           {{send "TOGGLE"}}
//         </Toggle>
//       </template>
//     );
//   });
// });