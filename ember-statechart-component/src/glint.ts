/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ComponentLike } from '@glint/template';
import type {
  Actor,
  ActorLogic,
  AnyActorRef,
  EventObject,
  MachineContext,
  MachineSnapshot,
  MetaObject,
  ParameterizedObject,
  ProvidedActor,
  StateSchema,
  StateValue,
} from 'xstate';

declare module 'xstate' {
  interface StateMachine<
    TContext extends MachineContext,
    TEvent extends EventObject,
    TChildren extends Record<string, AnyActorRef | undefined>,
    TActor extends ProvidedActor,
    TAction extends ParameterizedObject,
    TGuard extends ParameterizedObject,
    TDelay extends string,
    TStateValue extends StateValue,
    TTag extends string,
    TInput,
    TOutput,
    TEmitted extends EventObject,
    TMeta extends MetaObject,
    TConfig extends StateSchema,
  > extends ComponentLike<{
      Args: {
        config?: TConfig;
        context?: TContext;
        input?: TInput;
        snapshot?: TStateValue;
      };
      Blocks: {
        default: [
          snapshot: MachineSnapshot<
            TContext,
            TEvent,
            TChildren,
            TStateValue,
            TTag,
            TOutput,
            TMeta,
            TConfig
          >,
          actor: Actor<
            StateMachine<
              TContext,
              TEvent,
              TChildren,
              TActor,
              TAction,
              TGuard,
              TDelay,
              TStateValue,
              TTag,
              TInput,
              TOutput,
              TEmitted,
              TMeta,
              TConfig
            >
          >,
        ];
      };
    }> {
    // ,
    //   ActorLogic<
    //     MachineSnapshot<TContext, TEvent, TChildren, TStateValue, TTag, TOutput, TMeta, TConfig>,
    //     TEvent,
    //     TInput,
    //     any, // AnyActorSystem,
    //     TEmitted
    //   >
    // Indicator that we've messed with the types comeing from xstate.
    // (Also useful for debugging)
    __has_been_declaration_merged_from_ember_statechart_component__: string;
  }
}
