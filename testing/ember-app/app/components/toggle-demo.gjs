import { createMachine } from 'xstate';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

const Toggle = createMachine({
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } },
  },
});

<template>
  <Toggle as |state send|>
    {{state.value}}

    <button {{on 'click' (fn send 'TOGGLE')}}>
      Toggle
    </button>
  </Toggle>
</template>
