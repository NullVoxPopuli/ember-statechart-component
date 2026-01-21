import 'ember-statechart-component';
import { expectTypeOf } from 'expect-type';
import { createMachine, type MachineContext, type StateSchema, type StateValue } from 'xstate';

import type { ComponentLike } from '@glint/template';

const Toggle = createMachine({
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } },
  },
});

type SignatureFor<Component> =
  Component extends ComponentLike<infer Signature>
    ? Signature & { extracted: 'signture' }
    : { failed: 'failed to extract signature' };

/********************************
 *
 * Sanity checks so that we know
 * testing will actually work
 *
 * *****************************/
expectTypeOf<typeof Toggle>().toHaveProperty(
  '__has_been_declaration_merged_from_ember_statechart_component__'
);
expectTypeOf<SignatureFor<typeof Toggle>>().toHaveProperty('Args');
expectTypeOf<SignatureFor<typeof Toggle>>().toHaveProperty('Blocks');
expectTypeOf<SignatureFor<typeof Toggle>>().toHaveProperty('Element');

/********************************
 *
 * Did we merge the interface correctly?
 *
 * *****************************/
expectTypeOf<typeof Toggle>().not.toBeAny();
expectTypeOf<typeof Toggle>().not.toEqualTypeOf<
  ComponentLike<{
    Args: { invalid: number };
  }>
>();

expectTypeOf(Toggle).toMatchTypeOf<
  ComponentLike<{
    Args: any;
    Blocks: {
      default: [any, never];
    };
  }>
>();

expectTypeOf(Toggle).toMatchTypeOf<
  ComponentLike<{
    Args: any;
    Blocks: {
      default: [{ send: (type: string) => void }];
    };
  }>
>();

/********************************
 *
 * Is the Component Signature correct?
 *
 * *****************************/
expectTypeOf<SignatureFor<typeof Toggle>>().toMatchTypeOf<{
  Args: {
    config?: StateSchema;
    context?: MachineContext;
    input?: any;
    snapshot?: StateValue;
  };
}>();

expectTypeOf<SignatureFor<typeof Toggle>>().toMatchTypeOf<{
  Args: {
    // @ts-expect-error
    config: never;
  };
}>();
