import { Component, OnInit, Input, inject } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from '@angular/material/divider';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatStepperPrevious, MatStepperNext } from '@angular/material/stepper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-dynamic-deposit-product-settings-step',
  templateUrl: './dynamic-deposit-product-settings-step.component.html',
  styleUrls: ['./dynamic-deposit-product-settings-step.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatTooltip,
    MatDivider,
    MatCheckbox,
    MatStepperPrevious,
    FaIconComponent,
    MatStepperNext
  ]
})
export class DynamicDepositProductSettingsStepComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);

  @Input() dynamicDepositProductsTemplate: any;
  @Input() selectedCharges: any[] = [];

  dynamicDepositProductSettingsForm: UntypedFormGroup;

  lockinPeriodFrequencyTypeData: any;
  periodFrequencyTypeData: any;
  taxGroupData: any;
  withHoldTaxPostingTypeData: any;
  earlyWithdrawalChargeModeOptions: any[] = [];

  constructor() {
    this.createDynamicDepositProductSettingsForm();
    this.setConditionalControls();
  }

  ngOnInit() {
    this.lockinPeriodFrequencyTypeData = this.dynamicDepositProductsTemplate.lockinPeriodFrequencyTypeOptions;
    this.periodFrequencyTypeData = (this.dynamicDepositProductsTemplate.depositTermTypeOptions || []).slice(0, -1);
    this.taxGroupData = this.dynamicDepositProductsTemplate.taxGroupOptions;
    this.withHoldTaxPostingTypeData = this.dynamicDepositProductsTemplate.withHoldTaxPostingTypeOptions;
    this.earlyWithdrawalChargeModeOptions = this.dynamicDepositProductsTemplate.earlyWithdrawalChargeModeOptions || [];

    if (!(this.dynamicDepositProductsTemplate === undefined) && this.dynamicDepositProductsTemplate.id) {
      this.dynamicDepositProductSettingsForm.patchValue({
        lockinPeriodFrequency: this.dynamicDepositProductsTemplate.lockinPeriodFrequency,
        lockinPeriodFrequencyType: this.dynamicDepositProductsTemplate.lockinPeriodFrequencyType
          ? this.dynamicDepositProductsTemplate.lockinPeriodFrequencyType.id
          : '',
        minDepositTerm: this.dynamicDepositProductsTemplate.minDepositTerm,
        minDepositTermTypeId: this.dynamicDepositProductsTemplate.minDepositTermType
          ? this.dynamicDepositProductsTemplate.minDepositTermType.id
          : '',
        maxDepositTerm: this.dynamicDepositProductsTemplate.maxDepositTerm,
        maxDepositTermTypeId: this.dynamicDepositProductsTemplate.maxDepositTermType
          ? this.dynamicDepositProductsTemplate.maxDepositTermType.id
          : '',
        minBalanceForInterestCalculation: this.dynamicDepositProductsTemplate.minBalanceForInterestCalculation,
        allowWithdrawal: this.dynamicDepositProductsTemplate.allowWithdrawal,
        dynamicRateEnabled: this.dynamicDepositProductsTemplate.dynamicRateEnabled,
        earlyWithdrawalPenaltyEnabled: this.dynamicDepositProductsTemplate.earlyWithdrawalPenaltyEnabled,
        earlyWithdrawalChargeId: this.dynamicDepositProductsTemplate.earlyWithdrawalChargeId,
        earlyWithdrawalChargeMode: this.dynamicDepositProductsTemplate.earlyWithdrawalChargeMode || '',
        withHoldTax: this.dynamicDepositProductsTemplate.withHoldTax
      });
    }

    if (this.dynamicDepositProductsTemplate.withHoldTax) {
      this.dynamicDepositProductSettingsForm.patchValue({
        taxGroupId: this.dynamicDepositProductsTemplate.taxGroup ? this.dynamicDepositProductsTemplate.taxGroup.id : '',
        withHoldTaxPostingTypeId: this.dynamicDepositProductsTemplate.withHoldTaxPostingType
          ? this.dynamicDepositProductsTemplate.withHoldTaxPostingType.id
          : ''
      });
    }
  }

  createDynamicDepositProductSettingsForm() {
    this.dynamicDepositProductSettingsForm = this.formBuilder.group({
      lockinPeriodFrequency: [''],
      lockinPeriodFrequencyType: [''],
      minDepositTerm: [
        '',
        Validators.required
      ],
      minDepositTermTypeId: [
        '',
        Validators.required
      ],
      maxDepositTerm: [''],
      maxDepositTermTypeId: [''],
      minBalanceForInterestCalculation: [''],
      allowWithdrawal: [true],
      dynamicRateEnabled: [false],
      earlyWithdrawalPenaltyEnabled: [false],
      earlyWithdrawalChargeId: [''],
      earlyWithdrawalChargeMode: [''],
      withHoldTax: [false]
    });
  }

  setConditionalControls() {
    this.dynamicDepositProductSettingsForm
      .get('earlyWithdrawalPenaltyEnabled')
      .valueChanges.subscribe((enabled: boolean) => {
        const earlyWithdrawalChargeId = this.dynamicDepositProductSettingsForm.get('earlyWithdrawalChargeId');
        const earlyWithdrawalChargeMode = this.dynamicDepositProductSettingsForm.get('earlyWithdrawalChargeMode');
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

    this.dynamicDepositProductSettingsForm.get('withHoldTax').valueChanges.subscribe((withHoldTax: any) => {
      if (withHoldTax) {
        this.dynamicDepositProductSettingsForm.addControl(
          'taxGroupId',
          new UntypedFormControl('', Validators.required)
        );
        this.dynamicDepositProductSettingsForm.addControl(
          'withHoldTaxPostingTypeId',
          new UntypedFormControl('', Validators.required)
        );
        this.dynamicDepositProductSettingsForm
          .get('taxGroupId')
          .patchValue(this.dynamicDepositProductsTemplate.taxGroupId || '');
        this.dynamicDepositProductSettingsForm
          .get('withHoldTaxPostingTypeId')
          .patchValue(
            (this.dynamicDepositProductsTemplate.withHoldTaxPostingType &&
              this.dynamicDepositProductsTemplate.withHoldTaxPostingType.id) ||
              ''
          );
      } else {
        this.dynamicDepositProductSettingsForm.removeControl('taxGroupId');
        this.dynamicDepositProductSettingsForm.removeControl('withHoldTaxPostingTypeId');
      }
    });
  }

  get earlyWithdrawalChargeOptions(): any[] {
    const penaltyOptionIds = new Set(
      (this.dynamicDepositProductsTemplate?.penaltyOptions || []).map((charge: any) => charge.id)
    );
    const chargesById = new Map();
    [
      ...(this.selectedCharges || []),
      ...(this.dynamicDepositProductsTemplate?.charges || []),
      ...(this.dynamicDepositProductsTemplate?.penaltyOptions || []),
      ...(this.dynamicDepositProductsTemplate?.chargeOptions || [])
    ].forEach((charge: any) => {
      if (charge?.id && this.isInterestPenaltyCharge(charge, penaltyOptionIds)) {
        chargesById.set(charge.id, charge);
      }
    });
    return Array.from(chargesById.values());
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

  get dynamicDepositProductSettings() {
    const dynamicDepositProductSettings = this.dynamicDepositProductSettingsForm.value;
    if (!dynamicDepositProductSettings.earlyWithdrawalPenaltyEnabled) {
      dynamicDepositProductSettings.earlyWithdrawalChargeId = null;
      dynamicDepositProductSettings.earlyWithdrawalChargeMode = null;
    }
    for (const key in dynamicDepositProductSettings) {
      if (dynamicDepositProductSettings[key] === '') {
        delete dynamicDepositProductSettings[key];
      }
    }
    return dynamicDepositProductSettings;
  }
}
