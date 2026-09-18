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
 * Approve Dynamic Deposits Account Component
 */
@Component({
  selector: 'mifosx-approve-dynamic-deposits-account',
  templateUrl: './approve-dynamic-deposits-account.component.html',
  styleUrls: ['./approve-dynamic-deposits-account.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    CdkTextareaAutosize
  ]
})
export class ApproveDynamicDepositsAccountComponent implements OnInit {
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
  /** Approve Dynamic Deposits Account form. */
  approveDynamicDepositsAccountForm: UntypedFormGroup;
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
   * Creates the approve fixed deposits form.
   */
  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.createApproveDynamicDepositsAccountForm();
  }

  /**
   * Creates the approve fixed deposits account form.
   */
  createApproveDynamicDepositsAccountForm() {
    this.approveDynamicDepositsAccountForm = this.formBuilder.group({
      approvedOnDate: [
        '',
        Validators.required
      ],
      note: ['']
    });
  }

  /**
   * Submits the form and approves the fixed deposit account,
   * if successful redirects to the fixed deposit account.
   */
  submit() {
    const approveDynamicDepositsAccountFormData = this.approveDynamicDepositsAccountForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevApprovedOnDate: Date = this.approveDynamicDepositsAccountForm.value.approvedOnDate;
    if (approveDynamicDepositsAccountFormData.approvedOnDate instanceof Date) {
      approveDynamicDepositsAccountFormData.approvedOnDate = this.dateUtils.formatDate(prevApprovedOnDate, dateFormat);
    }
    const data = {
      ...approveDynamicDepositsAccountFormData,
      dateFormat,
      locale
    };
    this.dynamicDepositsService.executeDynamicDepositsAccountCommand(this.accountId, 'approve', data).subscribe(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }
}
