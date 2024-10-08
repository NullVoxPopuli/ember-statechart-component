import Application from 'test-app/app';
import config from 'test-app/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart } from 'ember-qunit';
import { setupComponentMachines } from 'ember-statechart-component';

setupComponentMachines();

export function start() {
  setApplication(Application.create(config.APP));

  setup(QUnit.assert);

  qunitStart();
}
