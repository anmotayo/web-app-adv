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
 * Premature Close Dynamic Deposits Account Component
 */
@Component({
  selector: 'mifosx-premature-close-dynamic-deposits-account',
  templateUrl: './premature-close-dynamic-deposits-account.component.html',
  styleUrls: ['./premature-close-dynamic-deposits-account.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    CdkTextareaAutosize
  ]
})
export class PrematureCloseDynamicDepositsAccountComponent implements OnInit {
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
  /** Premature Close FD Account form. */
  prematureCloseAccountForm: UntypedFormGroup;
  /** Savings Account Data */
  savingsAccountsData: any;
  /** On account Closure Options */
  onAccountClosureOptions: any;
  /** Dynamic Deposits Account Id */
  accountId: any;
  /** Form submission event */
  isSubmitted = false;

  /**
   * @param {FormBuilder} formBuilder Form Builder
   * @param {DynamicDepositsService} dynamicDepositsService Dynamic Deposits Service
   * @param {Dates} dateUtils Date Utils
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {SettingsService} settingsService Settings Service
   */
  constructor() {
    this.accountId = this.route.parent.snapshot.params['dynamicDepositAccountId'];
  }

  /**
   * Creates the premature close fd account form.
   */
  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.createPrematureCloseAccountForm();
    this.buildDependencies();
  }

  /**
   * Creates the premature close fd account form.
   */
  createPrematureCloseAccountForm() {
    this.prematureCloseAccountForm = this.formBuilder.group({
      closedOnDate: [
        '',
        Validators.required
      ]
    });
  }

  /**
   * Subscribes to value changes of parent control.
   */
  buildDependencies() {
    this.prematureCloseAccountForm.get('closedOnDate').valueChanges.subscribe((value: Date) => {
      if (!this.isSubmitted) {
        this.calculatePrematureAmount(value);
      }
    });
  }

  /**
   * Calculates prematue amount based on closed on date.
   * @param {Date} date Premature Close Date
   */
  calculatePrematureAmount(date: Date) {
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const data = {
      closedOnDate: this.dateUtils.formatDate(date, dateFormat),
      dateFormat,
      locale
    };
    this.dynamicDepositsService
      .executeDynamicDepositsAccountCommand(this.accountId, 'calculatePrematureAmount', data)
      .subscribe((response: any) => {
        this.savingsAccountsData = response.savingsAccounts;
        this.onAccountClosureOptions = response.onAccountClosureOptions;
        this.prematureCloseAccountForm.addControl(
          'maturityAmount',
          new UntypedFormControl({ value: '', disabled: true })
        );
        this.prematureCloseAccountForm.addControl(
          'onAccountClosureId',
          new UntypedFormControl('', Validators.required)
        );
        this.prematureCloseAccountForm.addControl('note', new UntypedFormControl(''));
        this.prematureCloseAccountForm.get('maturityAmount').patchValue(response.maturityAmount);
        this.addTransferDetails();
      });
  }

  /**
   * Subscribes to value changes of `onAccountClosureId` adds and removes transfer details accordingly.
   */
  addTransferDetails() {
    this.prematureCloseAccountForm.get('onAccountClosureId').valueChanges.subscribe((id: any) => {
      if (id === 200) {
        this.prematureCloseAccountForm.addControl(
          'toSavingsAccountId',
          new UntypedFormControl('', Validators.required)
        );
        this.prematureCloseAccountForm.addControl('transferDescription', new UntypedFormControl(''));
      } else {
        this.prematureCloseAccountForm.removeControl('toSavingsAccountId');
        this.prematureCloseAccountForm.removeControl('transferDescription');
      }
    });
  }

  /**
   * Submits the form and premature closes the fd account,
   * if successful redirects to the fd account.
   */
  submit() {
    const prematureCloseAccountFormData = this.prematureCloseAccountForm.value;
    this.isSubmitted = true;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevClosedDate: Date = this.prematureCloseAccountForm.value.closedOnDate;
    if (prematureCloseAccountFormData.closedOnDate instanceof Date) {
      prematureCloseAccountFormData.closedOnDate = this.dateUtils.formatDate(prevClosedDate, dateFormat);
    }
    const data = {
      ...prematureCloseAccountFormData,
      dateFormat,
      locale
    };
    this.dynamicDepositsService
      .executeDynamicDepositsAccountCommand(this.accountId, 'prematureClose', data)
      .subscribe(() => {
        this.router.navigate(['../../'], { relativeTo: this.route });
      });
  }
}
