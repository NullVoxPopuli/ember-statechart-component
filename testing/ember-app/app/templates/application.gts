import Route from 'ember-route-template';

import { Toggler } from './demos/toggle';

export default Route(
  <template>
    <Toggler />

    {{outlet}}
  </template>
);
