import { Component, OnInit, Input, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from '@angular/material/divider';
import { MatStepperPrevious, MatStepperNext } from '@angular/material/stepper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-dynamic-deposit-product-terms-step',
  templateUrl: './dynamic-deposit-product-terms-step.component.html',
  styleUrls: ['./dynamic-deposit-product-terms-step.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatTooltip,
    MatDivider,
    MatStepperPrevious,
    FaIconComponent,
    MatStepperNext
  ]
})
export class DynamicDepositProductTermsStepComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);

  @Input() dynamicDepositProductsTemplate: any;

  dynamicDepositProductTermsForm: UntypedFormGroup;

  interestCompoundingPeriodTypeData: any;
  interestPostingPeriodTypeData: any;
  interestCalculationTypeData: any;
  interestCalculationDaysInYearTypeData: any;

  constructor() {
    this.createDynamicDepositProductTermsForm();
  }

  ngOnInit() {
    this.interestCompoundingPeriodTypeData = this.dynamicDepositProductsTemplate.interestCompoundingPeriodTypeOptions;
    this.interestPostingPeriodTypeData = this.dynamicDepositProductsTemplate.interestPostingPeriodTypeOptions;
    this.interestCalculationTypeData = this.dynamicDepositProductsTemplate.interestCalculationTypeOptions;
    this.interestCalculationDaysInYearTypeData =
      this.dynamicDepositProductsTemplate.interestCalculationDaysInYearTypeOptions;

    if (!(this.dynamicDepositProductsTemplate === undefined) && this.dynamicDepositProductsTemplate.id) {
      this.dynamicDepositProductTermsForm.patchValue({
        minDepositAmount: this.dynamicDepositProductsTemplate.minDepositAmount,
        depositAmount: this.dynamicDepositProductsTemplate.depositAmount,
        maxDepositAmount: this.dynamicDepositProductsTemplate.maxDepositAmount
      });
    }

    this.dynamicDepositProductTermsForm.patchValue({
      interestCompoundingPeriodType: this.dynamicDepositProductsTemplate.interestCompoundingPeriodType.id,
      interestPostingPeriodType: this.dynamicDepositProductsTemplate.interestPostingPeriodType.id,
      interestCalculationType: this.dynamicDepositProductsTemplate.interestCalculationType.id,
      interestCalculationDaysInYearType: this.dynamicDepositProductsTemplate.interestCalculationDaysInYearType.id
    });
  }

  createDynamicDepositProductTermsForm() {
    this.dynamicDepositProductTermsForm = this.formBuilder.group({
      minDepositAmount: [''],
      depositAmount: [
        '',
        Validators.required
      ],
      maxDepositAmount: [''],
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
      ]
    });
  }

  get dynamicDepositProductTerms() {
    const dynamicDepositProductTerms = this.dynamicDepositProductTermsForm.value;
    for (const key in dynamicDepositProductTerms) {
      if (dynamicDepositProductTerms[key] === '') {
        delete dynamicDepositProductTerms[key];
      }
    }
    return dynamicDepositProductTerms;
  }
}
