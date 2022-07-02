import type { ComponentLike } from '@glint/template';
import type {
  ContextFrom,
  createMachine,
  EventFrom,
  Interpreter,
  MachineConfig,
  StateSchema,
} from 'xstate';

export type State<T = unknown> = Interpreter<ContextFrom<T>>['state'];
export type Send<T = unknown> = Interpreter<ContextFrom<T>>['send'];
export type OnTransition<T = unknown> = Interpreter<ContextFrom<T>>['onTransition'];

export type MachineComponent<T extends ReturnType<typeof createMachine>> = ComponentLike<{
  Args: {
    config?: MachineConfig<ContextFrom<T>, StateSchema<T>, EventFrom<T>>;
    context?: State<T>['context'];
    state?: Send<T>;
  };
  Blocks: {
    default: [State<T>, Send<T>, OnTransition<T>];
  };
}>;

export function asComponent<T extends typeof createMachine>(
  machine: T
): MachineComponent<ReturnType<T>> {
  return machine as unknown as MachineComponent<ReturnType<T>>;
}
