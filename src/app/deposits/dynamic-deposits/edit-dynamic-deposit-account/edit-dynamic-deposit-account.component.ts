/** Angular Imports */
import { Component, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Services */
import { DynamicDepositsService } from '../dynamic-deposits.service';
import { SettingsService } from 'app/settings/settings.service';

/** Custom Components */
import { DynamicDepositAccountDetailsStepComponent } from '../dynamic-deposit-account-stepper/dynamic-deposit-account-details-step/dynamic-deposit-account-details-step.component';
import { DynamicDepositAccountTermsStepComponent } from '../dynamic-deposit-account-stepper/dynamic-deposit-account-terms-step/dynamic-deposit-account-terms-step.component';
import { DynamicDepositAccountSettingsStepComponent } from '../dynamic-deposit-account-stepper/dynamic-deposit-account-settings-step/dynamic-deposit-account-settings-step.component';
import { DynamicDepositAccountChargesStepComponent } from '../dynamic-deposit-account-stepper/dynamic-deposit-account-charges-step/dynamic-deposit-account-charges-step.component';
import { Dates } from 'app/core/utils/dates';
import { Currency } from 'app/shared/models/general.model';
import { MatStepper, MatStepperIcon, MatStep, MatStepLabel } from '@angular/material/stepper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DynamicDepositAccountInterestRateChartStepComponent } from '../dynamic-deposit-account-stepper/dynamic-deposit-account-interest-rate-chart-step/dynamic-deposit-account-interest-rate-chart-step.component';
import { DynamicDepositAccountPreviewStepComponent } from '../dynamic-deposit-account-stepper/dynamic-deposit-account-preview-step/dynamic-deposit-account-preview-step.component';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Edit Dynamic Deposit Account Component
 */
@Component({
  selector: 'mifosx-edit-dynamic-deposit-account',
  templateUrl: './edit-dynamic-deposit-account.component.html',
  styleUrls: ['./edit-dynamic-deposit-account.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatStepper,
    MatStepperIcon,
    FaIconComponent,
    MatStep,
    MatStepLabel,
    DynamicDepositAccountDetailsStepComponent,
    DynamicDepositAccountTermsStepComponent,
    DynamicDepositAccountSettingsStepComponent,
    DynamicDepositAccountInterestRateChartStepComponent,
    DynamicDepositAccountChargesStepComponent,
    DynamicDepositAccountPreviewStepComponent
  ]
})
export class EditDynamicDepositAccountComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dateUtils = inject(Dates);
  private dynamicDepositsService = inject(DynamicDepositsService);
  private settingsService = inject(SettingsService);

  /** Dynamic Deposits Account Details Step */
  @ViewChild(DynamicDepositAccountDetailsStepComponent, { static: true })
  dynamicDepositsAccountDetailsStep: DynamicDepositAccountDetailsStepComponent;
  /** Dynamic Deposits Account Terms Step */
  @ViewChild(DynamicDepositAccountTermsStepComponent, { static: true })
  dynamicDepositAccountTermsStep: DynamicDepositAccountTermsStepComponent;
  /** Dynamic Deposits Account Settings Step */
  @ViewChild(DynamicDepositAccountSettingsStepComponent, { static: true })
  dynamicDepositAccountSettingsStep: DynamicDepositAccountSettingsStepComponent;
  /** Dynamic Deposits Account Charges Step */
  @ViewChild(DynamicDepositAccountChargesStepComponent, { static: true })
  dynamicDepositAccountChargesStep: DynamicDepositAccountChargesStepComponent;

  /** Dynamic Deposits Account Template */
  dynamicDepositsAccountAndTemplate: any;
  /** Dynamic Deposit Account Product Template */
  dynamicDepositsAccountProductTemplate: any;

  currency: Currency;

  /**
   * Fetches FD account template from `resolve`
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {Dates} dateUtils Date Utils
   * @param {DynamicDepositsService} dynamicDepositsService Dynamic Deposits Service
   * @param {SettingsService} settingsService Settings Service
   */
  constructor() {
    this.route.data.subscribe((data: { dynamicDepositsAccountAndTemplate: any }) => {
      this.dynamicDepositsAccountAndTemplate = data.dynamicDepositsAccountAndTemplate;
    });
  }

  /**
   * Sets fixed deposits account product template.
   * @param {any} $event API response
   */
  setTemplate($event: any) {
    this.dynamicDepositsAccountProductTemplate = $event;
    this.currency = this.dynamicDepositsAccountAndTemplate.currency;
  }

  /**
   * Retrieves Dynamic Deposit Account Details Form Data
   */
  get dynamicDepositAccountDetailsForm() {
    return this.dynamicDepositsAccountDetailsStep.dynamicDepositAccountDetailsForm;
  }

  /**
   * Retrieves Dynamic Deposit Account Terms Form Data
   */
  get dynamicDepositAccountTermsForm() {
    return this.dynamicDepositAccountTermsStep.dynamicDepositAccountTermsForm;
  }

  /**
   * Retrieves Dynamic Deposit Account Settings Form Data
   */
  get dynamicDepositAccountSettingsForm() {
    return this.dynamicDepositAccountSettingsStep.dynamicDepositAccountSettingsForm;
  }

  /**
   * Checks if stepper is valid and not pristine.
   */
  get dynamicDepositAccountFormValidAndNotPristine() {
    return (
      this.dynamicDepositAccountDetailsForm.valid &&
      this.dynamicDepositAccountTermsForm.valid &&
      this.dynamicDepositAccountSettingsForm.valid &&
      (!this.dynamicDepositAccountDetailsForm.pristine ||
        !this.dynamicDepositAccountTermsForm.pristine ||
        !this.dynamicDepositAccountSettingsForm.pristine ||
        !this.dynamicDepositAccountChargesStep.pristine)
    );
  }

  /**
   * Creates the fixed deposit account object.
   */
  get dynamicDepositAccount() {
    return {
      ...this.dynamicDepositsAccountDetailsStep.dynamicDepositAccountDetails,
      ...this.dynamicDepositAccountTermsStep.dynamicDepositAccountTerms,
      ...this.dynamicDepositAccountSettingsStep.dynamicDepositAccountSettings,
      ...this.dynamicDepositAccountChargesStep?.dynamicDepositAccountCharges
    };
  }

  /**
   * Submits the fixed deposit form and creates a new fixed deposit account
   */
  submit() {
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const monthDayFormat = 'dd MMMM';
    const dynamicDepositAccount = {
      ...this.dynamicDepositAccount,
      clientId: this.dynamicDepositsAccountAndTemplate.clientId,
      charges: (this.dynamicDepositAccount.charges || []).map((charge: any) => ({
        chargeId: charge.id,
        amount: charge.amount,
        dueDate: charge.dueDate && this.dateUtils.formatDate(charge.dueDate, dateFormat),
        feeOnMonthDay:
          charge.feeOnMonthDay && this.dateUtils.formatDate([2000].concat(charge.feeOnMonthDay), monthDayFormat),
        feeInterval: charge.feeInterval
      })),
      submittedOnDate: this.dateUtils.formatDate(this.dynamicDepositAccount.submittedOnDate, dateFormat),
      dateFormat,
      monthDayFormat,
      locale
    };
    this.dynamicDepositsService
      .updateDynamicDepositAccount(this.dynamicDepositsAccountAndTemplate.id, dynamicDepositAccount)
      .subscribe((response: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }
}
