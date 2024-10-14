import { expectTypeOf } from 'expect-type';
import { createMachine } from 'xstate';

import type { ComponentLike } from '@glint/template';

expectTypeOf(createMachine({})).toMatchTypeOf<
  ComponentLike<{
    Args: {
      input: any;
    };
    Blocks: {
      default: [any, any];
    };
  }>
>();
