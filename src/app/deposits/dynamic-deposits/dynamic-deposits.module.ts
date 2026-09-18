/** Angular Imports */
import { NgModule } from '@angular/core';

/** Custom Modules */
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from 'app/pipes/pipes.module';
import { DirectivesModule } from 'app/directives/directives.module';
import { DynamicDepositsRoutingModule } from './dynamic-deposits-routing.module';

/** Custom Components */
import { DynamicDepositAccountViewComponent } from './dynamic-deposit-account-view/dynamic-deposit-account-view.component';
import { TransactionsTabComponent } from './dynamic-deposit-account-view/transactions-tab/transactions-tab.component';
import { ChargesTabComponent } from './dynamic-deposit-account-view/charges-tab/charges-tab.component';
import { StandingInstructionsTabComponent } from './dynamic-deposit-account-view/standing-instructions-tab/standing-instructions-tab.component';
import { InterestRateChartTabComponent } from './dynamic-deposit-account-view/interest-rate-chart-tab/interest-rate-chart-tab.component';
import { DatatableTabsComponent } from './dynamic-deposit-account-view/datatable-tabs/datatable-tabs.component';
import { DynamicDepositsAccountActionsComponent } from './dynamic-deposits-account-actions/dynamic-deposits-account-actions.component';
import { ApproveDynamicDepositsAccountComponent } from './dynamic-deposits-account-actions/approve-dynamic-deposits-account/approve-dynamic-deposits-account.component';
import { RejectDynamicDepositsAccountComponent } from './dynamic-deposits-account-actions/reject-dynamic-deposits-account/reject-dynamic-deposits-account.component';
import { PostInterestDialogComponent } from './dynamic-deposit-account-view/custom-dialogs/post-interest-dialog/post-interest-dialog.component';
import { CalculateInterestDialogComponent } from './dynamic-deposit-account-view/custom-dialogs/calculate-interest-dialog/calculate-interest-dialog.component';
import { ToggleWithholdTaxDialogComponent } from './dynamic-deposit-account-view/custom-dialogs/toggle-withhold-tax-dialog/toggle-withhold-tax-dialog.component';
import { ActivateDynamicDepositsAccountComponent } from './dynamic-deposits-account-actions/activate-dynamic-deposits-account/activate-dynamic-deposits-account.component';
import { UndoApprovalDynamicDepositsAccountComponent } from './dynamic-deposits-account-actions/undo-approval-dynamic-deposits-account/undo-approval-dynamic-deposits-account.component';
import { WithdrawByClientDynamicDepositsAccountComponent } from './dynamic-deposits-account-actions/withdraw-by-client-dynamic-deposits-account/withdraw-by-client-dynamic-deposits-account.component';
import { ViewTransactionComponent } from './dynamic-deposit-account-view/view-transaction/view-transaction.component';
import { WaiveChargeDialogComponent } from './dynamic-deposit-account-view/custom-dialogs/waive-charge-dialog/waive-charge-dialog.component';
import { InactivateChargeDialogComponent } from './dynamic-deposit-account-view/custom-dialogs/inactivate-charge-dialog/inactivate-charge-dialog.component';
import { AddChargeDynamicDepositsAccountComponent } from './dynamic-deposits-account-actions/add-charge-dynamic-deposits-account/add-charge-dynamic-deposits-account.component';
import { PrematureCloseDynamicDepositsAccountComponent } from './dynamic-deposits-account-actions/premature-close-dynamic-deposits-account/premature-close-dynamic-deposits-account.component';
import { CloseDynamicDepositsAccountComponent } from './dynamic-deposits-account-actions/close-dynamic-deposits-account/close-dynamic-deposits-account.component';
import { CreateDynamicDepositAccountComponent } from './create-dynamic-deposit-account/create-dynamic-deposit-account.component';
import { DynamicDepositAccountDetailsStepComponent } from './dynamic-deposit-account-stepper/dynamic-deposit-account-details-step/dynamic-deposit-account-details-step.component';
import { DynamicDepositAccountTermsStepComponent } from './dynamic-deposit-account-stepper/dynamic-deposit-account-terms-step/dynamic-deposit-account-terms-step.component';
import { DynamicDepositAccountChargesStepComponent } from './dynamic-deposit-account-stepper/dynamic-deposit-account-charges-step/dynamic-deposit-account-charges-step.component';
import { DynamicDepositAccountSettingsStepComponent } from './dynamic-deposit-account-stepper/dynamic-deposit-account-settings-step/dynamic-deposit-account-settings-step.component';
import { DynamicDepositAccountInterestRateChartStepComponent } from './dynamic-deposit-account-stepper/dynamic-deposit-account-interest-rate-chart-step/dynamic-deposit-account-interest-rate-chart-step.component';
import { DynamicDepositAccountPreviewStepComponent } from './dynamic-deposit-account-stepper/dynamic-deposit-account-preview-step/dynamic-deposit-account-preview-step.component';
import { EditDynamicDepositAccountComponent } from './edit-dynamic-deposit-account/edit-dynamic-deposit-account.component';
import { GeneralTabComponent } from './dynamic-deposit-account-view/general-tab/general-tab.component';
import { DynamicDepositsCashTransactionComponent } from './dynamic-deposits-account-actions/dynamic-deposits-cash-transaction/dynamic-deposits-cash-transaction.component';
import { NotesTabComponent } from './dynamic-deposit-account-view/notes-tab/notes-tab.component';

/**
 * Dynamic Deposits Module
 *
 * All components related to fixed deposits functions should be declared here.
 */
@NgModule({
  imports: [
    SharedModule,
    PipesModule,
    DirectivesModule,
    DynamicDepositsRoutingModule,
    DynamicDepositAccountViewComponent,
    TransactionsTabComponent,
    ChargesTabComponent,
    StandingInstructionsTabComponent,
    InterestRateChartTabComponent,
    DatatableTabsComponent,
    DynamicDepositsAccountActionsComponent,
    ApproveDynamicDepositsAccountComponent,
    RejectDynamicDepositsAccountComponent,
    PostInterestDialogComponent,
    CalculateInterestDialogComponent,
    ToggleWithholdTaxDialogComponent,
    ActivateDynamicDepositsAccountComponent,
    UndoApprovalDynamicDepositsAccountComponent,
    WithdrawByClientDynamicDepositsAccountComponent,
    ViewTransactionComponent,
    WaiveChargeDialogComponent,
    InactivateChargeDialogComponent,
    AddChargeDynamicDepositsAccountComponent,
    PrematureCloseDynamicDepositsAccountComponent,
    CloseDynamicDepositsAccountComponent,
    CreateDynamicDepositAccountComponent,
    DynamicDepositAccountDetailsStepComponent,
    DynamicDepositAccountTermsStepComponent,
    DynamicDepositAccountChargesStepComponent,
    DynamicDepositAccountSettingsStepComponent,
    DynamicDepositAccountInterestRateChartStepComponent,
    DynamicDepositAccountPreviewStepComponent,
    EditDynamicDepositAccountComponent,
    GeneralTabComponent,
    DynamicDepositsCashTransactionComponent,
    NotesTabComponent
  ],
  providers: []
})
export class DynamicDepositsModule {}
