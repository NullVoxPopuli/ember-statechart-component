import { createMachine, StateFrom } from 'xstate';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

const Toggle = createMachine({
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } },
  },
});

const stateNamesOf = (state: StateFrom<typeof Toggle>) => state.toStrings().join(', ');

<template>
  <Toggle as |state send|>
    {{stateNamesOf state}}

    <button {{on 'click' (fn send 'TOGGLE' undefined)}}>
      Toggle
    </button>
  </Toggle>
</template>
