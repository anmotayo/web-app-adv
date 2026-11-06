/** Angular Imports */
import { Component, OnInit, Input, OnChanges, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { SettingsService } from 'app/settings/settings.service';
import { MatDivider } from '@angular/material/divider';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatStepperPrevious, MatStepperNext } from '@angular/material/stepper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Dynamic Deposits Account Settings Step
 */
@Component({
  selector: 'mifosx-dynamic-deposit-account-settings-step',
  templateUrl: './dynamic-deposit-account-settings-step.component.html',
  styleUrls: ['./dynamic-deposit-account-settings-step.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatDivider,
    MatCheckbox,
    MatStepperPrevious,
    FaIconComponent,
    MatStepperNext
  ]
})
export class DynamicDepositAccountSettingsStepComponent implements OnInit, OnChanges {
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
  /** Dynamic Deposits Account Settings Form */
  dynamicDepositAccountSettingsForm: UntypedFormGroup;
  /** Lockin Period Frequency Type Data */
  lockinPeriodFrequencyTypeData: any;
  /** Withhold Tax Posting Type Data */
  withHoldTaxPostingTypeData: any;
  /** Savings Accounts Data */
  savingsAccountsData: any;
  /** Whether the withhold tax value changes subscription has been registered. */
  withHoldTaxValueChangesSubscribed = false;

  /**
   * @param {FormBuilder} formBuilder Form Builder
   * @param {SettingsService} settingsService Settings Service
   */
  constructor() {
    this.createDynamicDepositAccountSettingsForm();
    this.buildDependencies();
  }

  ngOnChanges() {
    if (this.dynamicDepositsAccountProductTemplate) {
      this.dynamicDepositAccountSettingsForm.patchValue({
        lockinPeriodFrequency: this.dynamicDepositsAccountTemplate.id
          ? this.dynamicDepositsAccountTemplate.lockinPeriodFrequency
          : this.dynamicDepositsAccountProductTemplate.lockinPeriodFrequency,
        lockinPeriodFrequencyType: this.dynamicDepositsAccountTemplate.id
          ? this.dynamicDepositsAccountTemplate.lockinPeriodFrequencyType?.id
          : this.dynamicDepositsAccountProductTemplate.lockinPeriodFrequencyType?.id || '',
        allowWithdrawal: this.dynamicDepositsAccountTemplate.id
          ? this.dynamicDepositsAccountTemplate.allowWithdrawal
          : this.dynamicDepositsAccountProductTemplate.allowWithdrawal,
        dynamicRateEnabled: this.dynamicDepositsAccountTemplate.id
          ? this.dynamicDepositsAccountTemplate.dynamicRateEnabled
          : this.dynamicDepositsAccountProductTemplate.dynamicRateEnabled
      });
      if (this.dynamicDepositsAccountProductTemplate.withHoldTax) {
        if (!this.dynamicDepositAccountSettingsForm.contains('withHoldTax')) {
          this.dynamicDepositAccountSettingsForm.addControl('withHoldTax', new UntypedFormControl(false));
        }
        this.subscribeToWithHoldTaxChanges();
        this.dynamicDepositAccountSettingsForm.get('withHoldTax').patchValue(this.defaultWithHoldTaxValue());
        this.updateWithHoldTaxControls(this.defaultWithHoldTaxValue());
      } else {
        this.dynamicDepositAccountSettingsForm.removeControl('withHoldTax');
        this.dynamicDepositAccountSettingsForm.removeControl('taxGroupId');
        this.dynamicDepositAccountSettingsForm.removeControl('withHoldTaxPostingTypeId');
        this.withHoldTaxValueChangesSubscribed = false;
      }
      this.setOptions();
    }
  }

  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    if (this.dynamicDepositsAccountTemplate) {
      this.dynamicDepositAccountSettingsForm.patchValue({
        lockinPeriodFrequency: this.dynamicDepositsAccountTemplate.lockinPeriodFrequency,
        lockinPeriodFrequencyType:
          this.dynamicDepositsAccountTemplate.lockinPeriodFrequencyType &&
          this.dynamicDepositsAccountTemplate.lockinPeriodFrequencyType.id,
        transferInterestToSavings: this.dynamicDepositsAccountTemplate.transferInterestToSavings,
        allowWithdrawal: this.dynamicDepositsAccountTemplate.allowWithdrawal,
        dynamicRateEnabled: this.dynamicDepositsAccountTemplate.dynamicRateEnabled
      });
    }
  }

  /**
   * Creates fixed deposits account terms form.
   */
  createDynamicDepositAccountSettingsForm() {
    this.dynamicDepositAccountSettingsForm = this.formBuilder.group({
      lockinPeriodFrequency: [''],
      lockinPeriodFrequencyType: [''],
      allowWithdrawal: [true],
      dynamicRateEnabled: [false],
      transferInterestToSavings: [false]
    });
  }

  /**
   * Subscribes to value changes and sets new form controls accordingly.
   */
  buildDependencies() {
    this.dynamicDepositAccountSettingsForm.get('transferInterestToSavings').valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.dynamicDepositAccountSettingsForm.addControl(
          'linkAccountId',
          new UntypedFormControl('', Validators.required)
        );
        this.dynamicDepositAccountSettingsForm
          .get('linkAccountId')
          .patchValue(
            this.dynamicDepositsAccountTemplate.linkedAccount?.id ||
              this.dynamicDepositsAccountTemplate.linkAccountId ||
              ''
          );
      } else {
        this.dynamicDepositAccountSettingsForm.removeControl('linkAccountId');
      }
    });
  }

  /**
   * Sets all select dropdown options.
   */
  setOptions() {
    this.lockinPeriodFrequencyTypeData = this.dynamicDepositsAccountProductTemplate.lockinPeriodFrequencyTypeOptions;
    this.withHoldTaxPostingTypeData = this.dynamicDepositsAccountProductTemplate.withHoldTaxPostingTypeOptions;
    this.savingsAccountsData = this.dynamicDepositsAccountProductTemplate.savingsAccounts || [];
  }

  private updateWithHoldTaxControls(withHoldTax: boolean) {
    if (withHoldTax) {
      if (!this.dynamicDepositAccountSettingsForm.contains('taxGroupId')) {
        this.dynamicDepositAccountSettingsForm.addControl(
          'taxGroupId',
          new UntypedFormControl({ value: '', disabled: true })
        );
      }
      this.dynamicDepositAccountSettingsForm.get('taxGroupId').patchValue(this.taxGroupName());

      if (!this.dynamicDepositAccountSettingsForm.contains('withHoldTaxPostingTypeId')) {
        this.dynamicDepositAccountSettingsForm.addControl(
          'withHoldTaxPostingTypeId',
          new UntypedFormControl('', Validators.required)
        );
      }
      this.dynamicDepositAccountSettingsForm
        .get('withHoldTaxPostingTypeId')
        .patchValue(this.withHoldTaxPostingTypeId());
    } else {
      this.dynamicDepositAccountSettingsForm.removeControl('taxGroupId');
      this.dynamicDepositAccountSettingsForm.removeControl('withHoldTaxPostingTypeId');
    }
  }

  private subscribeToWithHoldTaxChanges() {
    if (this.withHoldTaxValueChangesSubscribed) {
      return;
    }
    this.dynamicDepositAccountSettingsForm.get('withHoldTax').valueChanges.subscribe((value: boolean) => {
      this.updateWithHoldTaxControls(value);
    });
    this.withHoldTaxValueChangesSubscribed = true;
  }

  private defaultWithHoldTaxValue(): boolean {
    return this.dynamicDepositsAccountTemplate?.id
      ? this.dynamicDepositsAccountTemplate.withHoldTax === true
      : this.dynamicDepositsAccountProductTemplate.withHoldTax === true;
  }

  private taxGroupName(): string {
    return (
      this.dynamicDepositsAccountTemplate?.taxGroup?.name ||
      this.dynamicDepositsAccountProductTemplate?.taxGroup?.name ||
      ''
    );
  }

  private withHoldTaxPostingTypeId(): number | string {
    return (
      this.dynamicDepositsAccountTemplate?.withHoldTaxPostingType?.id ||
      this.dynamicDepositsAccountProductTemplate?.withHoldTaxPostingType?.id ||
      ''
    );
  }

  /**
   * Returns fixed deposits account settings form value.
   */
  get dynamicDepositAccountSettings() {
    const dynamicDepositAccountSettings = this.dynamicDepositAccountSettingsForm.getRawValue();
    for (const key in dynamicDepositAccountSettings) {
      if (dynamicDepositAccountSettings[key] === '' || key === 'taxGroupId') {
        delete dynamicDepositAccountSettings[key];
      }
    }
    return dynamicDepositAccountSettings;
  }
}
