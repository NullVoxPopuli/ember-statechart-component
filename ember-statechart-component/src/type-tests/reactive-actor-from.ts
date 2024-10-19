/* eslint-disable @typescript-eslint/no-unused-vars */
import { expectTypeOf } from 'expect-type';
import { createMachine } from 'xstate';

import type { ReactiveActorFrom } from 'ember-statechart-component';

const Toggle = createMachine({
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } },
  },
});

expectTypeOf<ReactiveActorFrom<typeof Toggle>>().not.toBeAny();
expectTypeOf<ReactiveActorFrom<typeof Toggle>>().toHaveProperty('statePath');
expectTypeOf<ReactiveActorFrom<typeof Toggle>>().toHaveProperty('send');

expectTypeOf<ReactiveActorFrom<typeof Toggle>['send']>().toMatchTypeOf<(type: string) => void>();
