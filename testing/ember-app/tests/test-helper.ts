import { setApplication } from '@ember/test-helpers';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';

import Application from 'ember-app/app';
import config from 'ember-app/config/environment';
import { setupComponentMachines } from 'ember-statechart-component';

setApplication(Application.create(config.APP));

setupComponentMachines();
setup(QUnit.assert);

start();
