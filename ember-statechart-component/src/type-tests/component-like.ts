import { expectTypeOf } from 'expect-type';
import { createMachine } from 'xstate';

import type { ComponentLike } from '@glint/template';

expectTypeOf(
  createMachine({
    initial: 'inactive',
    states: {
      inactive: { on: { TOGGLE: 'active' } },
      active: { on: { TOGGLE: 'inactive' } },
    },
  })
).toMatchTypeOf<
  ComponentLike<{
    Args: any;
    Blocks: {
      default: [any, any];
    };
  }>
>();
