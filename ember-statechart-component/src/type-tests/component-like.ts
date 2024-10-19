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

expectTypeOf<typeof Toggle>().toHaveProperty(
  '__has_been_declaration_merged_from_ember_statechart_component__'
);

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

expectTypeOf<typeof Toggle>().toMatchTypeOf<
  ComponentLike<{
    Args: {
      config?: StateSchema;
      context?: MachineContext;
      input?: any;
      snapshot?: StateValue;
    };
  }>
>();

expectTypeOf<typeof Toggle>().toMatchTypeOf<
  ComponentLike<{
    Args: {
      // @ts-expect-error
      _does_not_exist: boolean;
    };
  }>
>();
