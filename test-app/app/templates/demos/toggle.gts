import { createMachine } from 'xstate';
import { toString } from './to-string';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

const Toggle = createMachine({
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } },
  },
});

export const Toggler = <template>
  <Toggle as |state send|>
    {{toString state.value}}

    <button type="button" {{on "click" (fn send "TOGGLE" undefined)}}>
      Toggle
    </button>
  </Toggle>
</template>;
