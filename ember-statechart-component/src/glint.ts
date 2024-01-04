/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentLike } from '@glint/template';
import type {
  AnyStateMachine,
  BaseActionObject,
  ContextFrom,
  EventFrom,
  EventObject,
  Interpreter,
  MachineConfig,
  MachineOptions,
  NoInfer,
  ResolveTypegenMeta,
  ServiceMap,
  StateFrom,
  StateMachine,
  StateSchema,
  TypegenDisabled,
  Typestate,
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

declare module 'xstate' {
  // We need to
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface StateMachine<
    TContext,
    TStateSchema extends StateSchema,
    TEvent extends EventObject,
    TTypestate extends Typestate<TContext> = { value: any; context: TContext },
    TAction extends BaseActionObject = BaseActionObject,
    TServiceMap extends ServiceMap = ServiceMap,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TResolvedTypesMeta = ResolveTypegenMeta<TypegenDisabled, NoInfer<TEvent>, TAction, TServiceMap>,
  > extends ComponentLike<{
      Args: {
        config?: MachineOptions<TContext, TEvent, TAction, TServiceMap>;
        context?: TContext;
        state?: Interpreter<TContext, TStateSchema, TEvent, TTypestate>['state'];
      };
      Blocks: {
        default: [
          Interpreter<TContext, TStateSchema, TEvent, TTypestate>['state'],
          Interpreter<TContext, TStateSchema, TEvent, TTypestate>['send'],
          Interpreter<TContext, TStateSchema, TEvent, TTypestate>['onTransition'],
        ];
      };
    }> {
    // Intentionally empty as we're changing StateMachine to extend from ComponentLike
  }
}

export function asComponent<T extends AnyStateMachine = any>(machine: T): MachineComponent<T> {
  return machine as unknown as MachineComponent<T>;
}
