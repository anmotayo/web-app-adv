/** Angular Imports */
import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Dates } from 'app/core/utils/dates';

/** Custom Services */
import { DynamicDepositsService } from 'app/deposits/dynamic-deposits/dynamic-deposits.service';
import { SettingsService } from 'app/settings/settings.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Withdrawn by Client Dynamic Deposits Account Component
 */
@Component({
  selector: 'mifosx-withdraw-by-client-dynamic-deposits-account',
  templateUrl: './withdraw-by-client-dynamic-deposits-account.component.html',
  styleUrls: ['./withdraw-by-client-dynamic-deposits-account.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    CdkTextareaAutosize
  ]
})
export class WithdrawByClientDynamicDepositsAccountComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private dynamicDepositsService = inject(DynamicDepositsService);
  private dateUtils = inject(Dates);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private settingsService = inject(SettingsService);

  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();
  /** Withdraw Dynamic Deposits Account form. */
  withdrawDynamicDepositsAccountForm: UntypedFormGroup;
  /** Dynamic Deposits Account Id */
  accountId: any;

  /**
   * @param {FormBuilder} formBuilder Form Builder
   * @param {DynamicDepositsService} dynamicDepositsService Dynamic Deposits Service
   * @param {Dates} dateUtils Date Utils
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {SettingsService} settingsService Settings Service
   */
  constructor() {
    this.accountId = this.route.parent.snapshot.params['dynamicDepositAccountId'];
  }

  /**
   * Creates the withdraw fixed deposits form.
   */
  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.createWithdrawDynamicDepositsAccountForm();
  }

  /**
   * Creates the withdraw fixed deposits account form.
   */
  createWithdrawDynamicDepositsAccountForm() {
    this.withdrawDynamicDepositsAccountForm = this.formBuilder.group({
      withdrawnOnDate: [
        '',
        Validators.required
      ],
      note: ['']
    });
  }

  /**
   * Submits the form and withdraws the fixed deposit account by client,
   * if successful redirects to the fixed deposit account.
   */
  submit() {
    const withdrawDynamicDepositsAccountFormData = this.withdrawDynamicDepositsAccountForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevWithdrawnOnDate: Date = this.withdrawDynamicDepositsAccountForm.value.withdrawnOnDate;
    if (withdrawDynamicDepositsAccountFormData.withdrawnOnDate instanceof Date) {
      withdrawDynamicDepositsAccountFormData.withdrawnOnDate = this.dateUtils.formatDate(
        prevWithdrawnOnDate,
        dateFormat
      );
    }
    const data = {
      ...withdrawDynamicDepositsAccountFormData,
      dateFormat,
      locale
    };
    this.dynamicDepositsService
      .executeDynamicDepositsAccountCommand(this.accountId, 'withdrawnByApplicant', data)
      .subscribe(() => {
        this.router.navigate(['../../'], { relativeTo: this.route });
      });
  }
}
