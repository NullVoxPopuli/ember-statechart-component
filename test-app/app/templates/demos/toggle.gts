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

export const Toggler = <template>
  <Toggle as |machine|>
     {{machine.statePath}}

     <button type="button" {{on "click" (fn machine.send "TOGGLE")}}>
       Toggle
     </button>
  </Toggle>
</template>;
