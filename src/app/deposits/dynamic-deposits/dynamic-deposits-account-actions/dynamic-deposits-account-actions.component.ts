/** Angular Imports */
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApproveDynamicDepositsAccountComponent } from './approve-dynamic-deposits-account/approve-dynamic-deposits-account.component';
import { RejectDynamicDepositsAccountComponent } from './reject-dynamic-deposits-account/reject-dynamic-deposits-account.component';
import { ActivateDynamicDepositsAccountComponent } from './activate-dynamic-deposits-account/activate-dynamic-deposits-account.component';
import { UndoApprovalDynamicDepositsAccountComponent } from './undo-approval-dynamic-deposits-account/undo-approval-dynamic-deposits-account.component';
import { WithdrawByClientDynamicDepositsAccountComponent } from './withdraw-by-client-dynamic-deposits-account/withdraw-by-client-dynamic-deposits-account.component';
import { AddChargeDynamicDepositsAccountComponent } from './add-charge-dynamic-deposits-account/add-charge-dynamic-deposits-account.component';
import { PrematureCloseDynamicDepositsAccountComponent } from './premature-close-dynamic-deposits-account/premature-close-dynamic-deposits-account.component';
import { CloseDynamicDepositsAccountComponent } from './close-dynamic-deposits-account/close-dynamic-deposits-account.component';
import { DynamicDepositsCashTransactionComponent } from './dynamic-deposits-cash-transaction/dynamic-deposits-cash-transaction.component';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Fixed deposits account actions component.
 */
@Component({
  selector: 'mifosx-dynamic-deposits-account-actions',
  templateUrl: './dynamic-deposits-account-actions.component.html',
  styleUrls: ['./dynamic-deposits-account-actions.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    ApproveDynamicDepositsAccountComponent,
    RejectDynamicDepositsAccountComponent,
    ActivateDynamicDepositsAccountComponent,
    UndoApprovalDynamicDepositsAccountComponent,
    WithdrawByClientDynamicDepositsAccountComponent,
    AddChargeDynamicDepositsAccountComponent,
    PrematureCloseDynamicDepositsAccountComponent,
    CloseDynamicDepositsAccountComponent,
    DynamicDepositsCashTransactionComponent
  ]
})
export class DynamicDepositsAccountActionsComponent {
  private route = inject(ActivatedRoute);

  /** Flag object to store possible actions and render appropriate UI to the user */
  actions: {
    Approve: boolean;
    Reject: boolean;
    Activate: boolean;
    Close: boolean;
    'Undo Approval': boolean;
    'Undo Activation': boolean;
    'Add Charge': boolean;
    'Premature Close': boolean;
    'Withdrawn by Client': boolean;
    Deposit: boolean;
    Withdrawal: boolean;
  } = {
    Approve: false,
    Reject: false,
    Activate: false,
    Close: false,
    'Undo Approval': false,
    'Undo Activation': false,
    'Add Charge': false,
    'Premature Close': false,
    'Withdrawn by Client': false,
    Deposit: false,
    Withdrawal: false
  };

  /**
   * @param {ActivatedRoute} route Activated Route
   */
  constructor() {
    const name = this.route.snapshot.params['name'];
    if (name && name in this.actions) {
      this.actions[name as keyof typeof this.actions] = true;
    }
  }
}
