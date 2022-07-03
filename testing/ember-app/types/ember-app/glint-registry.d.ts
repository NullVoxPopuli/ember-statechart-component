import "@glint/environment-ember-loose";
import "@glint/environment-ember-loose/native-integration";
import "ember-page-title/glint";

import type { HelperLike } from "@glint/template";

import type { MachineComponent } from 'ember-statechart-component/glint';

// declare module '@fortawesome/ember-fontawesome/components/fa-icon' {
//   export default ComponentLike;
// }

declare module "@glint/environment-ember-loose/registry" {
  export default interface Registry {
    // How to define globals from external addons
    // state: HelperLike<{ Args: {}, Return: State }>;
    // attachShadow: ModifierLike<{ Args: { Positional: [State['update']]}}>;

    /**
     *  Components
     */
     'ToggleMachine': MachineComponent<any>;
     'TestMachine': MachineComponent<any>;

    /**
     * Helpers
     */
     report: HelperLike<{
       Args: {
         Positional: [any]
       },
       Return: any
     }>
     'to-string': HelperLike<{
       Args: {
         Positional: [any]
       },
       Return: string;
     }>;
     /**
       * lazy way of not being able to disable
     * glint type checking in some templates
       */
     'to-any': HelperLike<{
       Args: {
         Positional: [any, string]
       },
       Return: any;
     }>;

    /**
     * Modifiers
     */
  }
}
