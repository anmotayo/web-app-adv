import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mifosx-recurring-deposit-product-settings-step',
  templateUrl: './recurring-deposit-product-settings-step.component.html',
  styleUrls: ['./recurring-deposit-product-settings-step.component.scss']
})
export class RecurringDepositProductSettingsStepComponent implements OnInit, OnDestroy {

  @Input() recurringDepositProductsTemplate: any;

  private $destroy = new Subject<void>();

  recurringDepositProductSettingsForm: UntypedFormGroup;

  lockinPeriodFrequencyTypeData: any;
  periodFrequencyTypeData: any;
  preClosurePenalInterestOnTypeData: any;
  taxGroupData: any;
  withHoldTaxPostingTypeData: any;

  constructor(private formBuilder: UntypedFormBuilder) {
    this.createrecurringDepositProductSettingsForm();
    this.setConditionalControls();
  }

  ngOnInit() {
    this.lockinPeriodFrequencyTypeData = this.recurringDepositProductsTemplate.lockinPeriodFrequencyTypeOptions;
    this.periodFrequencyTypeData = this.recurringDepositProductsTemplate.periodFrequencyTypeOptions.slice(0, -1);
    this.preClosurePenalInterestOnTypeData = this.recurringDepositProductsTemplate.preClosurePenalInterestOnTypeOptions;
    this.taxGroupData = this.recurringDepositProductsTemplate.taxGroupOptions;
    this.withHoldTaxPostingTypeData = this.recurringDepositProductsTemplate.withHoldTaxPostingTypeOptions;

    if (!(this.recurringDepositProductsTemplate === undefined) && this.recurringDepositProductsTemplate.id) {
      this.recurringDepositProductSettingsForm.patchValue({
        'isMandatoryDeposit': this.recurringDepositProductsTemplate.isMandatoryDeposit,
        'adjustAdvanceTowardsFuturePayments': this.recurringDepositProductsTemplate.adjustAdvanceTowardsFuturePayments,
        'allowWithdrawal': this.recurringDepositProductsTemplate.allowWithdrawal,
        'lockinPeriodFrequency': this.recurringDepositProductsTemplate.lockinPeriodFrequency,
        'lockinPeriodFrequencyType': this.recurringDepositProductsTemplate.lockinPeriodFrequencyType ? this.recurringDepositProductsTemplate.lockinPeriodFrequencyType.id : '',
        'minDepositTerm': this.recurringDepositProductsTemplate.minDepositTerm,
        'minDepositTermTypeId': this.recurringDepositProductsTemplate.minDepositTermType ? this.recurringDepositProductsTemplate.minDepositTermType.id : '',
        'inMultiplesOfDepositTerm': this.recurringDepositProductsTemplate.inMultiplesOfDepositTerm,
        'inMultiplesOfDepositTermTypeId': this.recurringDepositProductsTemplate.inMultiplesOfDepositTermType ? this.recurringDepositProductsTemplate.inMultiplesOfDepositTerm.id : '',
        'maxDepositTerm': this.recurringDepositProductsTemplate.maxDepositTerm,
        'maxDepositTermTypeId': this.recurringDepositProductsTemplate.maxDepositTermType ? this.recurringDepositProductsTemplate.minDepositTermType.id : '',
        'preClosurePenalApplicable': this.recurringDepositProductsTemplate.preClosurePenalApplicable,
        'preClosurePenalInterest': this.recurringDepositProductsTemplate.preClosurePenalInterest,
        'preClosurePenalInterestOnTypeId': this.recurringDepositProductsTemplate.preClosurePenalInterestOnType ? this.recurringDepositProductsTemplate.preClosurePenalInterestOnType.id : '',
        'withHoldTax': this.recurringDepositProductsTemplate.withHoldTax
      });
    }
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  createrecurringDepositProductSettingsForm() {
    this.recurringDepositProductSettingsForm = this.formBuilder.group({
      'isMandatoryDeposit': [false],
      'adjustAdvanceTowardsFuturePayments': [false],
      'allowWithdrawal': [false],
      'lockinPeriodFrequency': [''],
      'lockinPeriodFrequencyType': [''],
      'minDepositTerm': ['', Validators.required],
      'minDepositTermTypeId': ['', Validators.required],
      'inMultiplesOfDepositTerm': [''],
      'inMultiplesOfDepositTermTypeId': [''],
      'maxDepositTerm': [''],
      'maxDepositTermTypeId': [''],
      'preClosurePenalApplicable': [false],
      'preClosurePenalInterest': [''],
      'preClosurePenalInterestOnTypeId': [''],
      'withHoldTax': [false]
    });
  }

  setConditionalControls() {
    this.recurringDepositProductSettingsForm.get('withHoldTax').valueChanges
      .pipe(takeUntil(this.$destroy))
      .subscribe((withHoldTax: any) => {
        if (withHoldTax) {
          this.recurringDepositProductSettingsForm.addControl('taxGroupId', new UntypedFormControl('', Validators.required));
          this.recurringDepositProductSettingsForm.addControl('withHoldTaxPostingTypeId', new UntypedFormControl('', Validators.required));
          this.recurringDepositProductSettingsForm.get('taxGroupId').patchValue(this.recurringDepositProductsTemplate.taxGroup && this.recurringDepositProductsTemplate.taxGroup.id);
          this.recurringDepositProductSettingsForm.get('withHoldTaxPostingTypeId').patchValue(this.recurringDepositProductsTemplate.withHoldTaxPostingType && this.recurringDepositProductsTemplate.withHoldTaxPostingType.id);
        } else {
          this.recurringDepositProductSettingsForm.removeControl('taxGroupId');
          this.recurringDepositProductSettingsForm.removeControl('withHoldTaxPostingTypeId');
        }
      });
  }

  get recurringDepositProductSettings() {
    const recurringDepositProductSettings = this.recurringDepositProductSettingsForm.value;
    for (const key in recurringDepositProductSettings) {
      if (recurringDepositProductSettings[key] === '') {
        delete recurringDepositProductSettings[key];
      }
    }
    return recurringDepositProductSettings;
  }

}
