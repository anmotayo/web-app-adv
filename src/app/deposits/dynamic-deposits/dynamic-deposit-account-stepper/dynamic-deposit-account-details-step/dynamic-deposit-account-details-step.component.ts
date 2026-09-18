/** Angular Imports */
import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from 'app/settings/settings.service';

/** Custom Services */
import { DynamicDepositsService } from '../../dynamic-deposits.service';
import { MatTooltip } from '@angular/material/tooltip';
import { MatStepperPrevious, MatStepperNext } from '@angular/material/stepper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Dynamic Deposits Account Details Step
 */
@Component({
  selector: 'mifosx-dynamic-deposit-account-details-step',
  templateUrl: './dynamic-deposit-account-details-step.component.html',
  styleUrls: ['./dynamic-deposit-account-details-step.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatTooltip,
    MatStepperPrevious,
    FaIconComponent,
    MatStepperNext
  ]
})
export class DynamicDepositAccountDetailsStepComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private dynamicDepositsService = inject(DynamicDepositsService);
  private settingsService = inject(SettingsService);

  /** Dynamic Deposits Account Template */
  @Input() dynamicDepositsAccountTemplate: any;

  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();
  /** Product Data */
  productData: any;
  /** Field Officer Data */
  fieldOfficerData: any;
  /** For edit savings form */
  isFieldOfficerPatched = false;
  /** Dynamic Deposits Account Details Form */
  dynamicDepositAccountDetailsForm: UntypedFormGroup;

  isProductSelected = false;

  /** Dynamic Deposits Account Template with product data  */
  @Output() dynamicDepositsAccountProductTemplate = new EventEmitter();

  /**
   * Sets fixed deposits account details form.
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {DynamicDepositsService} dynamicDepositsService Dynamic Deposits Service.
   * @param {SettingsService} settingsService Settings Service
   */
  constructor() {
    this.createDynamicDepositsAccountDetailsForm();
  }

  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.buildDependencies();
    if (this.dynamicDepositsAccountTemplate) {
      this.productData = this.dynamicDepositsAccountTemplate.productOptions || [
        {
          id: this.dynamicDepositsAccountTemplate.savingsProductId,
          name: this.dynamicDepositsAccountTemplate.savingsProductName
        }
      ];
      if (
        this.dynamicDepositsAccountTemplate.savingsProductId ||
        this.dynamicDepositsAccountTemplate.depositProductId
      ) {
        this.dynamicDepositAccountDetailsForm.patchValue({
          productId:
            this.dynamicDepositsAccountTemplate.savingsProductId ||
            this.dynamicDepositsAccountTemplate.depositProductId,
          submittedOnDate:
            (this.dynamicDepositsAccountTemplate.submittedOnDate &&
              new Date(this.dynamicDepositsAccountTemplate.submittedOnDate)) ||
            (this.dynamicDepositsAccountTemplate.timeline?.submittedOnDate &&
              new Date(this.dynamicDepositsAccountTemplate.timeline.submittedOnDate)),
          externalId: this.dynamicDepositsAccountTemplate.externalId || ''
        });
      }
    }
  }

  /**
   * Creates fixed deposits account details form.
   */
  createDynamicDepositsAccountDetailsForm() {
    this.dynamicDepositAccountDetailsForm = this.formBuilder.group({
      productId: [
        '',
        Validators.required
      ],
      submittedOnDate: [
        '',
        Validators.required
      ],
      fieldOfficerId: [''],
      externalId: ['']
    });
  }

  /**
   * Fetches fixed deposits account product template on productId value changes
   */
  buildDependencies() {
    const clientId = this.dynamicDepositsAccountTemplate.clientId;
    this.dynamicDepositAccountDetailsForm.get('productId').valueChanges.subscribe((productId: string) => {
      this.dynamicDepositsService
        .getDynamicDepositsAccountProductTemplate(clientId, productId)
        .subscribe((response: any) => {
          this.dynamicDepositsAccountProductTemplate.emit(response);
          this.isProductSelected = true;
          this.fieldOfficerData = response.fieldOfficerOptions || [];
          if (!this.isFieldOfficerPatched && this.dynamicDepositsAccountTemplate.fieldOfficerId) {
            this.dynamicDepositAccountDetailsForm
              .get('fieldOfficerId')
              .patchValue(this.dynamicDepositsAccountTemplate.fieldOfficerId);
            this.isFieldOfficerPatched = true;
          } else {
            this.dynamicDepositAccountDetailsForm.get('fieldOfficerId').patchValue('');
          }
        });
    });
  }

  /**
   * Returns fixed deposits account details form value.
   */
  get dynamicDepositAccountDetails() {
    const dynamicDepositAccountDetails = this.dynamicDepositAccountDetailsForm.value;
    for (const key in dynamicDepositAccountDetails) {
      if (dynamicDepositAccountDetails[key] === '') {
        delete dynamicDepositAccountDetails[key];
      }
    }
    return dynamicDepositAccountDetails;
  }
}
