/** Angular Imports */
import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

/** Custom Services */
import { SavingsService } from 'app/savings/savings.service';
import { DynamicDepositsService } from '../../dynamic-deposits.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Undo Approval Dynamic Deposits Account Component
 */
@Component({
  selector: 'mifosx-undo-approval-dynamic-deposits-account',
  templateUrl: './undo-approval-dynamic-deposits-account.component.html',
  styleUrls: ['./undo-approval-dynamic-deposits-account.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    CdkTextareaAutosize
  ]
})
export class UndoApprovalDynamicDepositsAccountComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private savingsService = inject(SavingsService);
  private dynamicDepositsService = inject(DynamicDepositsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /** Undo Approval Dynamic Deposits Account form. */
  undoApprovalDynamicDepositsAccountForm: UntypedFormGroup;
  /** Dynamic Deposits Account Id */
  accountId: any;
  /** Action to be Undo */
  undoAction: string;
  undoCommand: string;

  /**
   * Fixed deposits endpoint is not supported so using Savings endpoint.
   * @param {FormBuilder} formBuilder Form Builder
   * @param {SavingsService} savingsService Savings Service
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   */
  constructor() {
    this.undoCommand = 'undoapproval'; // Default command
    this.undoAction = this.route.snapshot.params['name'];
    if (this.undoAction === 'Undo Activation') {
      this.undoCommand = 'undoactivate';
    }
    this.accountId = this.route.parent.snapshot.params['dynamicDepositAccountId'];
  }

  /**
   * Creates the undo-approval fixed deposits form.
   */
  ngOnInit() {
    this.createUndoApprovalDynamicDepositsAccountForm();
  }

  /**
   * Creates the undo-approval fixed deposits account form.
   */
  createUndoApprovalDynamicDepositsAccountForm() {
    this.undoApprovalDynamicDepositsAccountForm = this.formBuilder.group({
      note: ['']
    });
  }

  /**
   * Submits the form and undo the approval of fixed deposits account,
   * if successful redirects to the share account.
   */
  submit() {
    const data = {
      ...this.undoApprovalDynamicDepositsAccountForm.value
    };
    if (this.undoAction === 'Undo Activation') {
      this.dynamicDepositsService
        .executeDynamicDepositsAccountCommand(this.accountId, this.undoCommand, data)
        .subscribe(() => {
          this.router.navigate(['../../'], { relativeTo: this.route });
        });
    } else {
      this.savingsService.executeSavingsAccountCommand(this.accountId, this.undoCommand, data).subscribe(() => {
        this.router.navigate(['../../'], { relativeTo: this.route });
      });
    }
  }
}
