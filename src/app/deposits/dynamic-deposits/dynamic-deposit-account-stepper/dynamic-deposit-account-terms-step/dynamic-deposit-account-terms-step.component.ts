/** Angular Imports */
import { Component, OnInit, Input, OnChanges, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from 'app/settings/settings.service';
import { Currency } from 'app/shared/models/general.model';
import { InputAmountComponent } from '../../../../shared/input-amount/input-amount.component';
import { MatDivider } from '@angular/material/divider';
import { MatStepperPrevious, MatStepperNext } from '@angular/material/stepper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Dynamic Deposits Terms Step
 */
@Component({
  selector: 'mifosx-dynamic-deposit-account-terms-step',
  templateUrl: './dynamic-deposit-account-terms-step.component.html',
  styleUrls: ['./dynamic-deposit-account-terms-step.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    InputAmountComponent,
    MatDivider,
    MatStepperPrevious,
    FaIconComponent,
    MatStepperNext
  ]
})
export class DynamicDepositAccountTermsStepComponent implements OnInit, OnChanges {
  private formBuilder = inject(UntypedFormBuilder);
  private settingsService = inject(SettingsService);

  /** Fixed deposits account template */
  @Input() dynamicDepositsAccountTemplate: any;
  /** Fixed deposits account and product template */
  @Input() dynamicDepositsAccountProductTemplate: any;

  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();
  /** Dynamic Deposits Account Terms Form */
  dynamicDepositAccountTermsForm: UntypedFormGroup;
  /** Interest Compounding Period Type Data */
  interestCompoundingPeriodTypeData: any;
  /** Interest Posting Period Type Data */
  interestPostingPeriodTypeData: any;
  /** Interest Calculation Type Data */
  interestCalculationTypeData: any;
  /** Interest Calculation Days in Year Data */
  interestCalculationDaysInYearTypeData: any;
  /** Period Frequency Type Data */
  periodFrequencyTypeData: any;
  currency: Currency | null = null;

  /**
   * @param {FormBuilder} formBuilder Form Builder
   * @param {SettingsService} settingsService Settings Service
   */
  constructor() {
    this.createDynamicDepositsAccountTermsForm();
  }

  ngOnChanges() {
    if (this.dynamicDepositsAccountProductTemplate) {
      this.currency = this.dynamicDepositsAccountProductTemplate.currency;
      this.setOptions();
    }
  }

  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    if (this.dynamicDepositsAccountTemplate.id) {
      this.dynamicDepositAccountTermsForm.patchValue({
        interestCompoundingPeriodType: this.dynamicDepositsAccountTemplate.interestCompoundingPeriodType.id,
        interestPostingPeriodType: this.dynamicDepositsAccountTemplate.interestPostingPeriodType.id,
        interestCalculationType: this.dynamicDepositsAccountTemplate.interestCalculationType.id,
        interestCalculationDaysInYearType: this.dynamicDepositsAccountTemplate.interestCalculationDaysInYearType.id,
        depositAmount: this.dynamicDepositsAccountTemplate.depositAmount
          ? this.dynamicDepositsAccountTemplate.depositAmount
          : 0,
        depositPeriod: this.dynamicDepositsAccountTemplate.depositPeriod,
        depositPeriodFrequencyId:
          this.dynamicDepositsAccountTemplate.depositPeriodFrequencyType?.id ||
          this.dynamicDepositsAccountTemplate.depositPeriodFrequency?.id,
        nominalAnnualInterestRate: this.dynamicDepositsAccountTemplate.nominalAnnualInterestRate
      });
    }
  }

  /**
   * Creates fixed deposits account terms form.
   */
  createDynamicDepositsAccountTermsForm() {
    this.dynamicDepositAccountTermsForm = this.formBuilder.group({
      interestCompoundingPeriodType: [
        '',
        Validators.required
      ],
      interestPostingPeriodType: [
        '',
        Validators.required
      ],
      interestCalculationType: [
        '',
        Validators.required
      ],
      interestCalculationDaysInYearType: [
        '',
        Validators.required
      ],
      depositAmount: [
        0,
        Validators.required
      ],
      depositPeriod: [
        '',
        Validators.required
      ],
      depositPeriodFrequencyId: [
        '',
        Validators.required
      ],
      nominalAnnualInterestRate: ['']
    });
  }

  /**
   * Sets all select dropdown options.
   */
  setOptions() {
    this.interestCompoundingPeriodTypeData =
      this.dynamicDepositsAccountProductTemplate.interestCompoundingPeriodTypeOptions;
    this.interestPostingPeriodTypeData = this.dynamicDepositsAccountProductTemplate.interestPostingPeriodTypeOptions;
    this.interestCalculationTypeData = this.dynamicDepositsAccountProductTemplate.interestCalculationTypeOptions;
    this.interestCalculationDaysInYearTypeData =
      this.dynamicDepositsAccountProductTemplate.interestCalculationDaysInYearTypeOptions;
    this.periodFrequencyTypeData = this.dynamicDepositsAccountProductTemplate.periodFrequencyTypeOptions;
    if (!this.dynamicDepositsAccountTemplate.id) {
      this.dynamicDepositAccountTermsForm.patchValue({
        interestCompoundingPeriodType: this.dynamicDepositsAccountProductTemplate.interestCompoundingPeriodType?.id,
        interestPostingPeriodType: this.dynamicDepositsAccountProductTemplate.interestPostingPeriodType?.id,
        interestCalculationType: this.dynamicDepositsAccountProductTemplate.interestCalculationType?.id,
        interestCalculationDaysInYearType:
          this.dynamicDepositsAccountProductTemplate.interestCalculationDaysInYearType?.id,
        nominalAnnualInterestRate: this.dynamicDepositsAccountProductTemplate.nominalAnnualInterestRate,
        depositAmount: this.dynamicDepositsAccountProductTemplate.depositAmount || 0,
        depositPeriod: this.dynamicDepositsAccountProductTemplate.minDepositTerm || '',
        depositPeriodFrequencyId: this.dynamicDepositsAccountProductTemplate.minDepositTermType?.id || 2
      });
    }
  }

  /**
   * Returns fixed deposits account terms form value.
   */
  get dynamicDepositAccountTerms() {
    const dynamicDepositAccountTerms = this.dynamicDepositAccountTermsForm.value;
    for (const key in dynamicDepositAccountTerms) {
      if (dynamicDepositAccountTerms[key] === '') {
        delete dynamicDepositAccountTerms[key];
      }
    }
    return dynamicDepositAccountTerms;
  }
}
