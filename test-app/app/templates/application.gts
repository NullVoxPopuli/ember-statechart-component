import Route from 'ember-route-template';
import { pageTitle } from 'ember-page-title';

import { Toggler } from './demos/toggle';

export default Route(
  <template>
    {{pageTitle "Demo"}}

    {{outlet}}

    <Toggler />
  </template>
);
