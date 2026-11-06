/** Angular Imports */
import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Dates } from 'app/core/utils/dates';

/** Custom Services */
import { DynamicDepositsService } from 'app/deposits/dynamic-deposits/dynamic-deposits.service';
import { SettingsService } from 'app/settings/settings.service';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Activate Dynamic Deposits Account Component
 */
@Component({
  selector: 'mifosx-activate-dynamic-deposits-account',
  templateUrl: './activate-dynamic-deposits-account.component.html',
  styleUrls: ['./activate-dynamic-deposits-account.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS
  ]
})
export class ActivateDynamicDepositsAccountComponent implements OnInit {
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
  /** Activate Dynamic Deposits Account form. */
  activateDynamicDepositsAccountForm: UntypedFormGroup;
  /** Dynamic Deposits Account Id */
  accountId: any;

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
   * Creates the activate dynamic deposits form.
   */
  ngOnInit() {
    this.maxDate = this.settingsService.businessDate;
    this.createActivateDynamicDepositsAccountForm();
  }

  /**
   * Creates the activate dynamic deposits account form.
   */
  createActivateDynamicDepositsAccountForm() {
    this.activateDynamicDepositsAccountForm = this.formBuilder.group({
      activatedOnDate: [
        '',
        Validators.required
      ]
    });
  }

  /**
   * Submits the form and activates the dynamic deposit account,
   * if successful redirects to the dynamic deposit account.
   */
  submit() {
    const activateDynamicDepositsAccountFormData = this.activateDynamicDepositsAccountForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const prevActivatedOnDate: Date = this.activateDynamicDepositsAccountForm.value.activatedOnDate;
    if (activateDynamicDepositsAccountFormData.activatedOnDate instanceof Date) {
      activateDynamicDepositsAccountFormData.activatedOnDate = this.dateUtils.formatDate(
        prevActivatedOnDate,
        dateFormat
      );
    }
    const data = {
      ...activateDynamicDepositsAccountFormData,
      dateFormat,
      locale
    };
    this.dynamicDepositsService.executeDynamicDepositsAccountCommand(this.accountId, 'activate', data).subscribe(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }
}
