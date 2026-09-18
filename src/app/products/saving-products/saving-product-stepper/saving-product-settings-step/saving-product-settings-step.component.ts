import { Component, OnInit, Input, inject } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatStepperPrevious, MatStepperNext } from '@angular/material/stepper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-saving-product-settings-step',
  templateUrl: './saving-product-settings-step.component.html',
  styleUrls: ['./saving-product-settings-step.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatTooltip,
    MatCheckbox,
    MatDivider,
    MatStepperPrevious,
    FaIconComponent,
    MatStepperNext
  ]
})
export class SavingProductSettingsStepComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);

  @Input() savingProductsTemplate: any;
  @Input() selectedCharges: any[] = [];

  savingProductSettingsForm: UntypedFormGroup;

  lockinPeriodFrequencyTypeData: any;
  taxGroupData: any;
  earlyWithdrawalChargeModeOptions: any[] = [];

  constructor() {
    this.createSavingProductSettingsForm();
    this.setConditionalControls();
  }

  ngOnInit() {
    this.lockinPeriodFrequencyTypeData = this.savingProductsTemplate.lockinPeriodFrequencyTypeOptions;
    this.taxGroupData = this.savingProductsTemplate.taxGroupOptions;
    this.earlyWithdrawalChargeModeOptions = this.savingProductsTemplate.earlyWithdrawalChargeModeOptions || [];

    this.savingProductSettingsForm.patchValue({
      minRequiredOpeningBalance: this.savingProductsTemplate.minRequiredOpeningBalance,
      lockinPeriodFrequency: this.savingProductsTemplate.lockinPeriodFrequency,
      lockinPeriodFrequencyType:
        this.savingProductsTemplate.lockinPeriodFrequencyType &&
        this.savingProductsTemplate.lockinPeriodFrequencyType.id,
      withdrawalFeeForTransfers: this.savingProductsTemplate.withdrawalFeeForTransfers,
      minBalanceForInterestCalculation: this.savingProductsTemplate.minBalanceForInterestCalculation,
      enforceMinRequiredBalance: this.savingProductsTemplate.enforceMinRequiredBalance,
      minRequiredBalance: this.savingProductsTemplate.minRequiredBalance,
      allowOverdraft: this.savingProductsTemplate.allowOverdraft,
      minOverdraftForInterestCalculation: this.savingProductsTemplate.minOverdraftForInterestCalculation,
      nominalAnnualInterestRateOverdraft: this.savingProductsTemplate.nominalAnnualInterestRateOverdraft,
      overdraftLimit: this.savingProductsTemplate.overdraftLimit,
      withHoldTax: this.savingProductsTemplate.withHoldTax,
      taxGroupId: this.savingProductsTemplate.taxGroup && this.savingProductsTemplate.taxGroup.id,
      earlyWithdrawalPenaltyEnabled: this.savingProductsTemplate.earlyWithdrawalPenaltyEnabled,
      earlyWithdrawalChargeId: this.savingProductsTemplate.earlyWithdrawalChargeId || '',
      earlyWithdrawalChargeMode: this.savingProductsTemplate.earlyWithdrawalChargeMode || '',
      isDormancyTrackingActive: this.savingProductsTemplate.isDormancyTrackingActive,
      daysToInactive: this.savingProductsTemplate.daysToInactive,
      daysToDormancy: this.savingProductsTemplate.daysToDormancy,
      daysToEscheat: this.savingProductsTemplate.daysToEscheat
    });
  }

  createSavingProductSettingsForm() {
    this.savingProductSettingsForm = this.formBuilder.group({
      minRequiredOpeningBalance: [
        '',
        [Validators.min(0)]
      ],
      lockinPeriodFrequency: [
        '',
        [
          // Validators.required,
          Validators.min(1),
          Validators.pattern('^[1-9]\\d*$')
        ]
      ],
      lockinPeriodFrequencyType: [''],
      withdrawalFeeForTransfers: [false],
      minBalanceForInterestCalculation: [''],
      enforceMinRequiredBalance: [false],
      minRequiredBalance: [''],
      allowOverdraft: [false],
      withHoldTax: [false],
      earlyWithdrawalPenaltyEnabled: [false],
      earlyWithdrawalChargeId: [''],
      earlyWithdrawalChargeMode: [''],
      isDormancyTrackingActive: [false]
    });
  }

  setConditionalControls() {
    this.savingProductSettingsForm.get('allowOverdraft').valueChanges.subscribe((allowOverdraft: any) => {
      if (allowOverdraft) {
        this.savingProductSettingsForm.addControl('minOverdraftForInterestCalculation', new UntypedFormControl(''));
        this.savingProductSettingsForm.addControl('nominalAnnualInterestRateOverdraft', new UntypedFormControl(''));
        this.savingProductSettingsForm.addControl('overdraftLimit', new UntypedFormControl(''));
      } else {
        this.savingProductSettingsForm.removeControl('minOverdraftForInterestCalculation');
        this.savingProductSettingsForm.removeControl('nominalAnnualInterestRateOverdraft');
        this.savingProductSettingsForm.removeControl('overdraftLimit');
      }
    });

    this.savingProductSettingsForm.get('withHoldTax').valueChanges.subscribe((withHoldTax: any) => {
      if (withHoldTax) {
        this.savingProductSettingsForm.addControl('taxGroupId', new UntypedFormControl('', Validators.required));
      } else {
        this.savingProductSettingsForm.removeControl('taxGroupId');
      }
    });

    this.savingProductSettingsForm.get('earlyWithdrawalPenaltyEnabled').valueChanges.subscribe((enabled: boolean) => {
      const earlyWithdrawalChargeId = this.savingProductSettingsForm.get('earlyWithdrawalChargeId');
      const earlyWithdrawalChargeMode = this.savingProductSettingsForm.get('earlyWithdrawalChargeMode');
      if (enabled) {
        earlyWithdrawalChargeId.setValidators(Validators.required);
        earlyWithdrawalChargeMode.setValidators(Validators.required);
      } else {
        earlyWithdrawalChargeId.patchValue('');
        earlyWithdrawalChargeId.clearValidators();
        earlyWithdrawalChargeMode.patchValue('');
        earlyWithdrawalChargeMode.clearValidators();
      }
      earlyWithdrawalChargeId.updateValueAndValidity();
      earlyWithdrawalChargeMode.updateValueAndValidity();
    });

    this.savingProductSettingsForm
      .get('isDormancyTrackingActive')
      .valueChanges.subscribe((isDormancyTrackingActive: any) => {
        if (isDormancyTrackingActive) {
          this.savingProductSettingsForm.addControl('daysToInactive', new UntypedFormControl('', Validators.required));
          this.savingProductSettingsForm.addControl('daysToDormancy', new UntypedFormControl('', Validators.required));
          this.savingProductSettingsForm.addControl('daysToEscheat', new UntypedFormControl('', Validators.required));
        } else {
          this.savingProductSettingsForm.removeControl('daysToInactive');
          this.savingProductSettingsForm.removeControl('daysToDormancy');
          this.savingProductSettingsForm.removeControl('daysToEscheat');
        }
      });
  }

  get earlyWithdrawalChargeOptions(): any[] {
    const penaltyOptionIds = new Set(
      (this.savingProductsTemplate?.penaltyOptions || []).map((charge: any) => charge.id)
    );
    const chargesById = new Map();
    [
      ...(this.selectedCharges || []),
      ...(this.savingProductsTemplate?.charges || []),
      ...(this.savingProductsTemplate?.penaltyOptions || []),
      ...(this.savingProductsTemplate?.chargeOptions || [])
    ].forEach((charge: any) => {
      if (charge?.id && this.isInterestPenaltyCharge(charge, penaltyOptionIds)) {
        chargesById.set(charge.id, charge);
      }
    });
    return Array.from(chargesById.values());
  }

  get savingProductSettings() {
    const savingProductSettings = { ...this.savingProductSettingsForm.value };
    if (!savingProductSettings.earlyWithdrawalPenaltyEnabled) {
      if (this.shouldSendDisabledEarlyWithdrawal()) {
        savingProductSettings.earlyWithdrawalChargeId = null;
        savingProductSettings.earlyWithdrawalChargeMode = null;
      } else {
        delete savingProductSettings.earlyWithdrawalPenaltyEnabled;
        delete savingProductSettings.earlyWithdrawalChargeId;
        delete savingProductSettings.earlyWithdrawalChargeMode;
      }
    }
    return savingProductSettings;
  }

  private shouldSendDisabledEarlyWithdrawal(): boolean {
    return (
      this.hasTemplateParameter('earlyWithdrawalPenaltyEnabled') ||
      this.hasTemplateParameter('earlyWithdrawalChargeId') ||
      this.hasTemplateParameter('earlyWithdrawalChargeMode') ||
      this.savingProductSettingsForm.get('earlyWithdrawalPenaltyEnabled').dirty ||
      this.savingProductSettingsForm.get('earlyWithdrawalChargeId').dirty ||
      this.savingProductSettingsForm.get('earlyWithdrawalChargeMode').dirty
    );
  }

  private hasTemplateParameter(parameterName: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.savingProductsTemplate || {}, parameterName);
  }

  private isInterestPenaltyCharge(charge: any, penaltyOptionIds: Set<any>): boolean {
    const calculationType = charge?.chargeCalculationType || {};
    const calculationTypeText = `${calculationType.code || ''} ${calculationType.value || ''}`.toLowerCase();
    return (
      (charge?.penalty === true || penaltyOptionIds.has(charge?.id)) &&
      (calculationType.id === 4 ||
        calculationTypeText.includes('percent.of.interest') ||
        calculationTypeText.includes('% interest') ||
        calculationTypeText.includes('percent of interest'))
    );
  }
}
