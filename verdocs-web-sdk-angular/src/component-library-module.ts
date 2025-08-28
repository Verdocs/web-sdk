import { NgModule } from "@angular/core";
/**
 * NOTE: All proxy components are now Angular standalone components.
 * Do NOT import or export them via an NgModule.
 * Instead, import each proxy directly where needed:
 *
 * import { VerdocsAuth } from './directives/proxies';
 *
 * @see https://angular.io/guide/standalone-components
 */

@NgModule({
  // No declarations or exports needed for standalone proxies.
  imports: [],
  providers: []
})
export class ComponentLibraryModule {}
