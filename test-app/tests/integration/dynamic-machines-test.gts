import { clearRender, click, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

import { assign, createMachine, setup } from 'xstate';

import type { Interpreter } from 'xstate';

// Pending fix in glimmer-vm
// state.matches *should* just work
const call = (obj, fun, ...args) => fun.call(obj, ...args);

module('Dynamic Machines', function (hooks) {
  setupRenderingTest(hooks);

  // module('xstate#spawn', function () {
  //   test('Can have a dynamically created machine and is reactive', async function (assert) {
  //     function createNested(context: Record<string, unknown>, config: any = {}) {
  //       return createMachine({
  //         id: 'nested',
  //         initial: 'inactive',
  //
  //         context: {
  //           inactive: 0,
  //           active: 0,
  //           ...context,
  //         },
  //
  //         states: {
  //           inactive: {
  //             entry: ['incrementInactive'],
  //             on: { TOGGLE: 'active' },
  //           },
  //           active: {
  //             entry: ['incrementActive'],
  //             on: { TOGGLE: 'inactive' },
  //           },
  //         },
  //       }).withConfig(config);
  //     }
  //
  //     const parentMachine = createMachine({
  //       id: 'parent',
  //       initial: 'idle',
  //
  //       states: {
  //         idle: {
  //           on: {
  //             SPAWN: 'spawnNested',
  //           },
  //         },
  //         spawnNested: {
  //           entry: assign({
  //             someRef: (_context, { nested, id }: any) => {
  //               return spawn(nested, id);
  //             },
  //           }),
  //         },
  //       },
  //     });
  //
  //     this.owner.register('component:test-machine', parentMachine);
  //
  //     let active = 0;
  //     let inactive = 0;
  //
  //     this.setProperties({
  //       startNested: (send: Send) =>
  //         send('SPAWN', {
  //           id: 'named-spawned-machine',
  //           nested: createNested(
  //             { active: 3 },
  //             {
  //               actions: {
  //                 incrementActive: () => active++,
  //                 incrementInactive: () => inactive++,
  //               },
  //             }
  //           ),
  //         }),
  //     });
  //
  //     await render(hbs`
  //       <TestMachine as |state send|>
  //         {{to-string state.value}}
  //
  //         <button id='spawn' type="button" {{on 'click' (fn this.startNested send)}}>Spawn Nested Machine</button>
  //
  //         {{#if (to-any state 'context.someRef')}}
  //           {{!--
  //             someRef.state does not have a reactive wrapper, like the root interpreter does
  //
  //             TODO: make this reactive
  //           --}}
  //           {{to-any state 'context.someRef.state.value'}}
  //
  //           <button id='toggle' type="button" {{on 'click' (fn (to-any state 'context.someRef.send') 'TOGGLE' undefined)}}>Toggle</button>
  //         {{/if}}
  //
  //       </TestMachine>
  //     `);
  //
  //     assert.dom().containsText('idle');
  //     assert.strictEqual(active, 0);
  //     assert.strictEqual(inactive, 0);
  //
  //     await click('#spawn');
  //     assert.strictEqual(active, 0);
  //     assert.strictEqual(inactive, 1);
  //
  //     assert.dom().containsText('spawnNested');
  //
  //     /**
  //      * There is not a way to easily access spawned machines
  //      * internal state, so we've wired up some actions / callbacks
  //      *
  //      * (the way to access the nested state is state.children[machine-id].state)
  //      */
  //     await click('#toggle');
  //
  //     assert.strictEqual(active, 1);
  //     assert.strictEqual(inactive, 1);
  //
  //     await click('#toggle');
  //
  //     assert.strictEqual(active, 1);
  //     assert.strictEqual(inactive, 2);
  //   });
  // });

  module('xstate#invoke', function () {
    test('it works with invoked machines', async function (assert) {
      // Invoked child machine
      const minuteMachine = createMachine({
        initial: 'active',
        states: {
          active: {
            on: {
              DECLARE_DONE: 'finished',
            },
          },
          finished: { type: 'final' },
        },
      });

      const parentMachine = createMachine({
        id: 'parent',
        initial: 'pending',
        states: {
          pending: {
            invoke: {
              id: 'timer',
              src: minuteMachine,
              onDone: 'timesUp',
            },
          },
          timesUp: {
            type: 'final',
          },
        },
      });

      const declareDone = { type: 'DECLARE_DONE' };
      const value = (x) => x?.getSnapshot?.()?.value;

      await render(
        <template>
          <parentMachine as |state|>
            <div id="parent">{{state.value}}</div>
            <div id="child">{{value state.children.timer}}</div>

            <button {{on 'click' (fn state.children.timer.send declareDone)}}>
              Declare invoked machine as Done
            </button>
          </parentMachine>
        </template>
      );

      assert.dom('#parent').containsText('pending');
      assert.dom('#child').containsText('active');

      await click('button');

      assert.dom('#parent').containsText('timesUp');
      assert.dom('#child').hasNoText('the machine destroyed itself (on purpose)');
    });

    test('it works with the child machine updating its own context', async function (assert) {
      const childMachine = setup({
          actions: {
            updateContext: assign({
              prop1: () => {
return 'new value';
},
            }),
          },
        }).createMachine({
          id: 'child-machine',
          initial: 'idleChild',
          context: ({ input }) => { return input },
          states: {
            idleChild: {
              entry: () => { assert.step('entry: child.idleChild'); },
              exit: () => { assert.step('exit: child.idleChild'); },
              on: {
                UPDATE_CONTEXT: { actions: ['updateContext'] },
              },
            },
          },
        },
      );

      const parentMachine = createMachine({
        id: 'parent-state-machine',
        initial: 'idle',
        states: {
          idle: {
            entry: () => { assert.step('entry: parent.idle'); },
            exit: () => { assert.step('exit: parent.idle'); },
            on: { INVOKE_CHILD: 'withChildMachine' },
          },
          withChildMachine: {
            entry: () => { assert.step('entry: parent.withChildMachine'); },
            exit: () => { assert.step('exit: parent.withChildMachine'); },
            invoke: {
              id: 'child-machine',
              src: childMachine,
              input: () => ({ prop1: 'original value', }),
            },
            on: {
              RESET: 'idle',
            },
          },
        },
      });

      const invokeChild = { type: 'INVOKE_CHILD' };
      const reset = { type: 'RESET' };
      const updateContext = { type: 'UPDATE_CONTEXT' };
      const prop = (x) => x?.children?.['child-machine']?.getSnapshot().context.prop1;
      const update = (x) => x.children['child-machine'].send(updateContext);
      const snapshot = (x) => x.children['child-machine']?.getSnapshot();
      const getValue = (x) => x.value;

      await render(
        <template>
          <parentMachine as |state send|>

            {{#if (call state state.matches 'idle')}}
              <button id="invoke-child" {{on 'click' (fn send invokeChild)}}>Invoke Child</button>
            {{else}}
              <button id='reset' {{on 'click' (fn send reset)}}>Reset</button>


              <button id="update-context" {{on 'click' (fn update state)}}>
                Update Context
              </button>

              <out>{{prop state}}</out>
              <div>
                debug:<br>
                parent: {{state.value}}<br>
                child: {{getValue (snapshot state)}}
              </div>
            {{/if}}
          </parentMachine>
        </template>
      );

      await click('#invoke-child');

      assert.dom('out').containsText('original value');

      await click('#update-context');

      assert.dom('out').containsText('new value');

      assert.verifySteps([
        'entry: parent.idle',
        'exit: parent.idle',
        'entry: child.idleChild',
        'entry: parent.withChildMachine',
      ]);

      await clearRender();

      assert.verifySteps(['exit: parent.withChildMachine', 'exit: child.idleChild']);
    });
  });
});
