/** Angular Imports */
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

/** rxjs Imports */
import { EMPTY, merge } from 'rxjs';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';

/** Custom Services */
import { DynamicDepositsService } from '../../dynamic-deposits.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/** Closure type id of "Transfer to Savings". */
const TRANSFER_TO_SAVINGS = 200;

/**
 * Premature Close Dynamic Deposits Account Component
 *
 * Previews what closing on the chosen date pays out - the closing interest, withholding tax and any early-withdrawal
 * forfeiture - and closes the account with it. The preview is computed by the backend with the closure's own
 * settlement, so what is shown is what is paid.
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
  private destroyRef = inject(DestroyRef);

  /** Minimum date allowed. */
  minDate = new Date(2000, 0, 1);
  /** Maximum date allowed. */
  maxDate = new Date();
  /** Premature Close Dynamic Deposit Account form. */
  prematureCloseAccountForm: UntypedFormGroup;
  /** Savings Account Data */
  savingsAccountsData: any;
  /** On account Closure Options */
  onAccountClosureOptions: any;
  /** Dynamic Deposits Account Id */
  accountId: any;
  /** What closing on the chosen date would pay out, or undefined until a valid date is chosen. */
  preview: any;
  /** Form submission event */
  isSubmitted = false;

  constructor() {
    this.accountId = this.route.parent.snapshot.params['dynamicDepositAccountId'];
  }

  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.createPrematureCloseAccountForm();
    this.buildDependencies();
  }

  /**
   * Creates the premature close form. The closure controls (action, note) are added once the first preview arrives.
   */
  createPrematureCloseAccountForm() {
    this.prematureCloseAccountForm = this.formBuilder.group({
      closedOnDate: [
        '',
        Validators.required
      ],
      earlyWithdrawalChargePercentage: [
        '',
        [
          Validators.min(0),
          Validators.max(100)
        ]
      ]
    });
  }

  /**
   * Refreshes the preview whenever the date or the early-withdrawal charge percentage changes. A newer request
   * cancels an older one still in flight, so a slow response can never overwrite a newer one.
   */
  buildDependencies() {
    const closedOnDate = this.prematureCloseAccountForm.get('closedOnDate');
    const percentage = this.prematureCloseAccountForm.get('earlyWithdrawalChargePercentage');
    merge(closedOnDate.valueChanges, percentage.valueChanges.pipe(debounceTime(400)))
      .pipe(
        switchMap(() => {
          if (this.isSubmitted || !closedOnDate.value || percentage.invalid) {
            return EMPTY;
          }
          return this.dynamicDepositsService
            .executeDynamicDepositsAccountCommand(this.accountId, 'calculatePrematureAmount', this.previewRequest())
            .pipe(
              catchError(() => {
                // The backend refuses, for instance, a date on or after maturity; the error is already reported, so
                // there is simply nothing to confirm until the date is changed.
                this.preview = undefined;
                return EMPTY;
              })
            );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((response: any) => this.showPreview(response));
  }

  /** The request body of the preview: the chosen date and, when one was entered, the percentage override. */
  private previewRequest(): any {
    const form = this.prematureCloseAccountForm.value;
    const request: any = {
      closedOnDate: this.dateUtils.formatDate(form.closedOnDate, this.settingsService.dateFormat),
      dateFormat: this.settingsService.dateFormat,
      locale: this.settingsService.language.code
    };
    if (this.hasPercentage(form.earlyWithdrawalChargePercentage)) {
      request.earlyWithdrawalChargePercentage = form.earlyWithdrawalChargePercentage;
    }
    return request;
  }

  private hasPercentage(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  /**
   * Shows a preview, adding the closure controls the first time.
   * @param {any} response What `calculatePrematureAmount` returned.
   */
  private showPreview(response: any) {
    this.preview = response;
    this.savingsAccountsData = response.savingsAccounts;
    this.onAccountClosureOptions = response.onAccountClosureOptions;
    if (!this.prematureCloseAccountForm.contains('onAccountClosureId')) {
      this.prematureCloseAccountForm.addControl(
        'maturityAmount',
        new UntypedFormControl({ value: '', disabled: true })
      );
      this.prematureCloseAccountForm.addControl('onAccountClosureId', new UntypedFormControl('', Validators.required));
      this.prematureCloseAccountForm.addControl('note', new UntypedFormControl(''));
      this.addTransferDetails();
    }
    this.prematureCloseAccountForm.get('maturityAmount').patchValue(response.maturityAmount);
  }

  /**
   * Subscribes to value changes of `onAccountClosureId` adds and removes transfer details accordingly.
   */
  addTransferDetails() {
    this.prematureCloseAccountForm
      .get('onAccountClosureId')
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id: any) => {
        if (id === TRANSFER_TO_SAVINGS) {
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
   * Submits the form and premature closes the dynamic deposit account,
   * if successful redirects to the dynamic deposit account.
   */
  submit() {
    const prematureCloseAccountFormData = { ...this.prematureCloseAccountForm.value };
    this.isSubmitted = true;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevClosedDate: Date = this.prematureCloseAccountForm.value.closedOnDate;
    if (prematureCloseAccountFormData.closedOnDate instanceof Date) {
      prematureCloseAccountFormData.closedOnDate = this.dateUtils.formatDate(prevClosedDate, dateFormat);
    }
    if (!this.hasPercentage(prematureCloseAccountFormData.earlyWithdrawalChargePercentage)) {
      delete prematureCloseAccountFormData.earlyWithdrawalChargePercentage;
    }
    const data = {
      ...prematureCloseAccountFormData,
      dateFormat,
      locale
    };
    this.dynamicDepositsService.executeDynamicDepositsAccountCommand(this.accountId, 'prematureClose', data).subscribe({
      next: () => this.router.navigate(['../../'], { relativeTo: this.route }),
      // Stay on the form, and let the preview refresh again, if the closure was refused.
      error: () => (this.isSubmitted = false)
    });
  }
}
