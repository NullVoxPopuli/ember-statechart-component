/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentLike } from '@glint/template';
import type {
  AnyStateMachine,
  ContextFrom,
  EventFrom,
  Interpreter,
  MachineConfig,
  StateFrom,
  StateMachine,
  StateSchema,
} from 'xstate';

type StateSchemaFrom<T> = T extends StateMachine<any, infer U, any> ? U : StateSchema;

export type State<T = unknown> = Interpreter<ContextFrom<T>>['state'];
export type Send<T = unknown> = Interpreter<ContextFrom<T>>['send'];
export type OnTransition<T = unknown> = Interpreter<ContextFrom<T>>['onTransition'];

export type MachineComponent<T extends AnyStateMachine = any> = ComponentLike<{
  Args: {
    config?: MachineConfig<ContextFrom<T>, StateSchemaFrom<T>, EventFrom<T>>;
    context?: StateFrom<T>['context'];
    state?: StateFrom<T>;
  };
  Blocks: {
    default: [State<T>, Send<T>, OnTransition<T>];
  };
}>;

export function asComponent<T extends AnyStateMachine = any>(machine: T): MachineComponent<T> {
  return machine as unknown as MachineComponent<T>;
}
