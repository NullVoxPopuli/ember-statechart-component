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

const asEvent = (name) => ({ type: name });
export const Toggler = <template>
  <Toggle as |state send|>
     {{state.value}}

     <button type="button" {{on "click" (fn send (asEvent "TOGGLE"))}}>
       Toggle
     </button>
  </Toggle>
</template>;
