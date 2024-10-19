import { createMachine } from 'xstate';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

import type { ReactiveActorFrom } from 'ember-statechart-component';

const Toggle = createMachine({
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } },
  },
});

function allCapsState(machine: ReactiveActorFrom<typeof Toggle>) {
  return machine.statePath;
}

export const Toggler = <template>
  <Toggle as |toggle|>
    {{toggle.statePath}}

    {{allCapsState toggle}}

    <button type="button" {{on "click" (fn toggle.send "TOGGLE")}}>
      Toggle
    </button>
  </Toggle>
</template>;
