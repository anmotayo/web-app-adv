/** Angular Imports */
import { Component, OnInit, inject } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Dates } from 'app/core/utils/dates';

/** Custom Services */
import { SavingsService } from 'app/savings/savings.service';
import { SettingsService } from 'app/settings/settings.service';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Add Dynamic Deposits Charge component.
 * Fixed deposits endpoint is not supported so using Savings endpoint.
 */
@Component({
  selector: 'mifosx-add-charge-dynamic-deposits-account',
  templateUrl: './add-charge-dynamic-deposits-account.component.html',
  styleUrls: ['./add-charge-dynamic-deposits-account.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS
  ]
})
export class AddChargeDynamicDepositsAccountComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dateUtils = inject(Dates);
  private savingsService = inject(SavingsService);
  private settingsService = inject(SettingsService);

  /** Minimum Due Date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum Due Date allowed. */
  maxDate = new Date();
  /** Add Dynamic Deposits Charge form. */
  dynamicDepositsChargeForm: UntypedFormGroup;
  /** savings charge options. */
  savingsChargeOptions: any;
  /** savings Id of the savings account. */
  dynamicDepositAccountId: string;
  /** charge details */
  chargeDetails: any;

  /**
   * Retrieves charge template data from `resolve`
   * @param {FormBuilder} formBuilder Form Builder
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {Dates} dateUtils Date Utils
   * @param {SavingsService} savingsService Savings Service
   * @param {SettingsService} settingsService Settings Service
   */
  constructor() {
    this.route.data.subscribe((data: { dynamicDepositsAccountActionData: any }) => {
      this.savingsChargeOptions = data.dynamicDepositsAccountActionData.chargeOptions;
    });
    this.dynamicDepositAccountId = this.route.parent.snapshot.params['dynamicDepositAccountId'];
  }

  /**
   * Creates the Dynamic Deposits Charge form.
   */
  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.createDynamicDepositsChargeForm();
    this.buildDependencies();
  }

  buildDependencies() {
    this.dynamicDepositsChargeForm.controls.chargeId.valueChanges.subscribe((chargeId) => {
      this.savingsService.getChargeTemplate(chargeId).subscribe((data: any) => {
        this.chargeDetails = data;
        const chargeTimeType = data.chargeTimeType.id;
        if (data.chargeTimeType.value === 'Withdrawal Fee' || data.chargeTimeType.value === 'Saving No Activity Fee') {
          this.chargeDetails.dueDateNotRequired = true;
        }
        if (data.chargeTimeType.value === 'Annual Fee' || data.chargeTimeType.value === 'Monthly Fee') {
          this.chargeDetails.chargeTimeTypeAnnualOrMonth = true;
        }
        if (!this.chargeDetails.dueDateNotRequired && !this.chargeDetails.chargeTimeTypeAnnualOrMonth) {
          this.dynamicDepositsChargeForm.addControl('dueDate', new UntypedFormControl('', Validators.required));
        } else {
          this.dynamicDepositsChargeForm.removeControl('dueDate');
        }
        if (!this.chargeDetails.dueDateNotRequired && this.chargeDetails.chargeTimeTypeAnnualOrMonth) {
          this.dynamicDepositsChargeForm.addControl('feeOnMonthDay', new UntypedFormControl('', Validators.required));
        } else {
          this.dynamicDepositsChargeForm.removeControl('feeOnMonthDay');
        }
        if (chargeTimeType.value === 'Monthly Fee') {
          this.dynamicDepositsChargeForm.addControl(
            'feeInterval',
            new UntypedFormControl(data.feeInterval, Validators.required)
          );
        } else {
          this.dynamicDepositsChargeForm.removeControl('feeInterval');
        }
        this.dynamicDepositsChargeForm.patchValue({
          amount: data.amount,
          chargeCalculationType: data.chargeCalculationType.id,
          chargeTimeType: data.chargeTimeType.id
        });
      });
    });
  }

  /**
   * Creates the Dynamic Deposits Charge form.
   */
  createDynamicDepositsChargeForm() {
    this.dynamicDepositsChargeForm = this.formBuilder.group({
      chargeId: [
        '',
        Validators.required
      ],
      amount: [
        '',
        Validators.required
      ],
      chargeCalculationType: [{ value: '', disabled: true }],
      chargeTimeType: [{ value: '', disabled: true }]
    });
  }

  /**
   * Submits savings charge.
   */
  submit() {
    const savingsCharge = this.dynamicDepositsChargeForm.value;
    savingsCharge.locale = this.settingsService.language.code;
    if (!savingsCharge.feeInterval) {
      savingsCharge.feeInterval = this.chargeDetails.feeInterval;
    }
    if (this.chargeDetails.dueDateNotRequired !== true) {
      if (this.chargeDetails.chargeTimeTypeAnnualOrMonth === true) {
        const monthDayFormat = 'MMMM-dd'; // TODO: Update once language and date settings are setup
        savingsCharge.monthDayFormat = monthDayFormat;
        if (savingsCharge.feeOnMonthDay) {
          const prevDate = this.dynamicDepositsChargeForm.value.feeOnMonthDay;
          savingsCharge.feeOnMonthDay = this.dateUtils.formatDate(prevDate, monthDayFormat);
        }
      } else {
        const dateFormat = this.settingsService.dateFormat;
        savingsCharge.dateFormat = dateFormat;
        if (savingsCharge.dueDate) {
          const prevDate = this.dynamicDepositsChargeForm.value.dueDate;
          savingsCharge.dueDate = this.dateUtils.formatDate(prevDate, dateFormat);
        }
      }
    }
    this.savingsService.createSavingsCharge(this.dynamicDepositAccountId, 'charges', savingsCharge).subscribe(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }
}
