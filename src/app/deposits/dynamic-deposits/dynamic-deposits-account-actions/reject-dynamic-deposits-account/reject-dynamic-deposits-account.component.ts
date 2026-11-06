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
 * Reject Dynamic Deposits Account Component
 */
@Component({
  selector: 'mifosx-reject-dynamic-deposits-account',
  templateUrl: './reject-dynamic-deposits-account.component.html',
  styleUrls: ['./reject-dynamic-deposits-account.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    CdkTextareaAutosize
  ]
})
export class RejectDynamicDepositsAccountComponent implements OnInit {
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
  /** Reject Dynamic Deposit Account form. */
  rejectDynamicDepositsAccountForm: UntypedFormGroup;
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
   * Creates the reject fixed deposits form.
   */
  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.createRejectDynamicDepositsAccountForm();
  }

  /**
   * Creates the reject fixed deposits account form.
   */
  createRejectDynamicDepositsAccountForm() {
    this.rejectDynamicDepositsAccountForm = this.formBuilder.group({
      rejectedOnDate: [
        '',
        Validators.required
      ],
      note: ['']
    });
  }

  /**
   * Submits the form and rejects the fixed deposit account,
   * if successful redirects to the fixed deposit account.
   */
  submit() {
    const rejectDynamicDepositsAccountFormData = this.rejectDynamicDepositsAccountForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevRejectedOnDate: Date = this.rejectDynamicDepositsAccountForm.value.rejectedOnDate;
    if (rejectDynamicDepositsAccountFormData.rejectedOnDate instanceof Date) {
      rejectDynamicDepositsAccountFormData.rejectedOnDate = this.dateUtils.formatDate(prevRejectedOnDate, dateFormat);
    }
    const data = {
      ...rejectDynamicDepositsAccountFormData,
      dateFormat,
      locale
    };
    this.dynamicDepositsService.executeDynamicDepositsAccountCommand(this.accountId, 'reject', data).subscribe(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }
}
