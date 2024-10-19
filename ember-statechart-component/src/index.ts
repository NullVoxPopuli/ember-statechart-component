import './registration.js';

import { assert } from '@ember/debug';
import { getOwner } from '@ember/owner';

import type { Registry } from '@ember/service';
import type { ComponentSignatureBlocks } from '@glint/template/-private/signature';
import type {
  AnyActorRef,
  EventObject,
  MachineContext,
  MetaObject,
  ParameterizedObject,
  ProvidedActor,
  StateMachine,
  StateSchema,
  StateValue,
} from 'xstate';

export { UPDATE_EVENT_NAME } from './-private/statechart-manager.js';

export function getService<Key extends keyof Registry>(
  context: unknown,
  serviceName: Key
): Registry[Key] {
  let owner = getOwner(context as object);

  assert(`Expected passed context to be aware of the container (owner)`, owner);

  let service = owner.lookup(`service:${serviceName}`) as Registry[Key];

  return service;
}

export type ReactiveActor<
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
> = ComponentSignatureBlocks<
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
  // TODO: how to get this info?
>['default'][0];
