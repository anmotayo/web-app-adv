import { Component, OnInit, Input, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatStepperPrevious, MatStepperNext } from '@angular/material/stepper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-dynamic-deposit-product-currency-step',
  templateUrl: './dynamic-deposit-product-currency-step.component.html',
  styleUrls: ['./dynamic-deposit-product-currency-step.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatStepperPrevious,
    FaIconComponent,
    MatStepperNext
  ]
})
export class DynamicDepositProductCurrencyStepComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);

  @Input() dynamicDepositProductsTemplate: any;

  dynamicDepositProductCurrencyForm: UntypedFormGroup;

  currencyData: any;

  constructor() {
    this.createDynamicDepositProductCurrencyForm();
  }

  ngOnInit() {
    this.currencyData = this.dynamicDepositProductsTemplate.currencyOptions;

    if (!(this.dynamicDepositProductsTemplate === undefined) && this.dynamicDepositProductsTemplate.id) {
      this.dynamicDepositProductCurrencyForm.patchValue({
        currencyCode: this.dynamicDepositProductsTemplate.currency.code,
        digitsAfterDecimal: this.dynamicDepositProductsTemplate.currency.decimalPlaces,
        inMultiplesOf: this.dynamicDepositProductsTemplate.currency.inMultiplesOf
      });
    } else {
      this.dynamicDepositProductCurrencyForm.patchValue({
        currencyCode: this.currencyData[0].code,
        digitsAfterDecimal: 2
      });
    }
  }

  createDynamicDepositProductCurrencyForm() {
    this.dynamicDepositProductCurrencyForm = this.formBuilder.group({
      currencyCode: [
        '',
        Validators.required
      ],
      digitsAfterDecimal: [
        '',
        Validators.required
      ],
      inMultiplesOf: ['']
    });
  }

  get dynamicDepositProductCurrency() {
    return this.dynamicDepositProductCurrencyForm.value;
  }
}
