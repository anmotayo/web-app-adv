/** Angular Imports */
import { Component, OnInit, inject } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

/** Custom Services */
import { DynamicDepositsService } from '../../dynamic-deposits.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Close On Maturity Dynamic Deposits Account Component
 */
@Component({
  selector: 'mifosx-close-dynamic-deposits-account',
  templateUrl: './close-dynamic-deposits-account.component.html',
  styleUrls: ['./close-dynamic-deposits-account.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    CdkTextareaAutosize
  ]
})
export class CloseDynamicDepositsAccountComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private dynamicDepositsService = inject(DynamicDepositsService);
  private dateUtils = inject(Dates);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private settingsService = inject(SettingsService);

  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();
  /** Close on maturity FD Account form. */
  closeOnMaturityAccountForm: UntypedFormGroup;
  /** Savings Account Data */
  savingsAccountsData: any;
  /** On account Closure Options */
  onAccountClosureOptions: any;
  /** Dynamic Deposits Account Id */
  accountId: any;
  /** Maturity Amount */
  maturityAmount: any;

  /**
   * Fetches close action data from `resolve`
   * @param {FormBuilder} formBuilder Form Builder
   * @param {DynamicDepositsService} dynamicDepositsService Dynamic Deposits Service
   * @param {Dates} dateUtils Date Utils
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {SettingsService} settingsService Settings Service
   */
  constructor() {
    this.route.data.subscribe((data: { dynamicDepositsAccountActionData: any }) => {
      this.savingsAccountsData = data.dynamicDepositsAccountActionData.savingsAccounts;
      this.onAccountClosureOptions = data.dynamicDepositsAccountActionData.onAccountClosureOptions;
      this.maturityAmount = data.dynamicDepositsAccountActionData.maturityAmount;
    });
    this.accountId = this.route.parent.snapshot.params['dynamicDepositAccountId'];
  }

  /**
   * Creates the close on maturity fd account form.
   */
  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.createCloseOnMaturityAccountForm();
    this.addTransferDetails();
  }

  /**
   * Creates the close on maturity fd account form.
   */
  createCloseOnMaturityAccountForm() {
    this.closeOnMaturityAccountForm = this.formBuilder.group({
      closedOnDate: [
        '',
        Validators.required
      ],
      maturityAmount: [{ value: this.maturityAmount, disabled: true }],
      onAccountClosureId: [
        '',
        Validators.required
      ],
      note: ['']
    });
  }

  /**
   * Subscribes to value changes of `onAccountClosureId` adds and removes transfer details accordingly.
   */
  addTransferDetails() {
    this.closeOnMaturityAccountForm.get('onAccountClosureId').valueChanges.subscribe((id: any) => {
      if (id === 200) {
        this.closeOnMaturityAccountForm.addControl(
          'toSavingsAccountId',
          new UntypedFormControl('', Validators.required)
        );
        this.closeOnMaturityAccountForm.addControl('transferDescription', new UntypedFormControl(''));
      } else {
        this.closeOnMaturityAccountForm.removeControl('toSavingsAccountId');
        this.closeOnMaturityAccountForm.removeControl('transferDescription');
      }
    });
  }

  /**
   * Submits the form and close the fd account on maturity,
   * if successful redirects to the fd account.
   */
  submit() {
    const closeOnMaturityAccountFormData = this.closeOnMaturityAccountForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevClosedDate: Date = this.closeOnMaturityAccountForm.value.closedOnDate;
    if (closeOnMaturityAccountFormData.closedOnDate instanceof Date) {
      closeOnMaturityAccountFormData.closedOnDate = this.dateUtils.formatDate(prevClosedDate, dateFormat);
    }
    const data = {
      ...closeOnMaturityAccountFormData,
      dateFormat,
      locale
    };
    this.dynamicDepositsService.executeDynamicDepositsAccountCommand(this.accountId, 'close', data).subscribe(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }
}
