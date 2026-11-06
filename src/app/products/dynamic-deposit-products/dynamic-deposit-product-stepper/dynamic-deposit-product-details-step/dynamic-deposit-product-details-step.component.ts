import { Component, OnInit, Input, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatStepperPrevious, MatStepperNext } from '@angular/material/stepper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-dynamic-deposit-product-details-step',
  templateUrl: './dynamic-deposit-product-details-step.component.html',
  styleUrls: ['./dynamic-deposit-product-details-step.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatStepperPrevious,
    FaIconComponent,
    MatStepperNext
  ]
})
export class DynamicDepositProductDetailsStepComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);

  @Input() dynamicDepositProductsTemplate: any;

  dynamicDepositProductDetailsForm: UntypedFormGroup;

  constructor() {
    this.createDynamicDepositProductDetailsForm();
  }

  ngOnInit() {
    if (!(this.dynamicDepositProductsTemplate === undefined) && this.dynamicDepositProductsTemplate.id) {
      this.dynamicDepositProductDetailsForm.patchValue({
        name: this.dynamicDepositProductsTemplate.name,
        shortName: this.dynamicDepositProductsTemplate.shortName,
        description: this.dynamicDepositProductsTemplate.description
      });
    }
  }

  createDynamicDepositProductDetailsForm() {
    this.dynamicDepositProductDetailsForm = this.formBuilder.group({
      name: [
        '',
        Validators.required
      ],
      shortName: [
        '',
        Validators.required
      ],
      description: [
        '',
        Validators.required
      ]
    });
  }

  get dynamicDepositProductDetails() {
    return this.dynamicDepositProductDetailsForm.value;
  }
}
