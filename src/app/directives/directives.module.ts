/** Angular Imports */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Custom Directives */
import { HasPermissionDirective } from './has-permission/has-permission.directive';
import { FormatAmountDirective } from './format-amount.directive';
import { PendingActionDirective } from './pending-action.directive';

/**
 *  Directives Module
 *
 *  All custom directives should be declared and exported here.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HasPermissionDirective, FormatAmountDirective, PendingActionDirective],
  exports: [HasPermissionDirective, FormatAmountDirective, PendingActionDirective]
})
export class DirectivesModule { }
