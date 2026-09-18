/** Angular Imports */
import { Component, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Components */
import { SavingProductDetailsStepComponent } from '../saving-product-stepper/saving-product-details-step/saving-product-details-step.component';
import { SavingProductCurrencyStepComponent } from '../saving-product-stepper/saving-product-currency-step/saving-product-currency-step.component';
import { SavingProductTermsStepComponent } from '../saving-product-stepper/saving-product-terms-step/saving-product-terms-step.component';
import { SavingProductSettingsStepComponent } from '../saving-product-stepper/saving-product-settings-step/saving-product-settings-step.component';
import { SavingProductChargesStepComponent } from '../saving-product-stepper/saving-product-charges-step/saving-product-charges-step.component';
import { SavingProductAccountingStepComponent } from '../saving-product-stepper/saving-product-accounting-step/saving-product-accounting-step.component';

/** Custom Services */
import { ProductsService } from 'app/products/products.service';
import { SettingsService } from 'app/settings/settings.service';
import { Accounting } from 'app/core/utils/accounting';
import { MatStepper, MatStepperIcon, MatStep, MatStepLabel } from '@angular/material/stepper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { SavingProductPreviewStepComponent } from '../saving-product-stepper/saving-product-preview-step/saving-product-preview-step.component';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-create-saving-product',
  templateUrl: './create-saving-product.component.html',
  styleUrls: ['./create-saving-product.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatStepper,
    MatStepperIcon,
    FaIconComponent,
    MatStep,
    MatStepLabel,
    SavingProductDetailsStepComponent,
    SavingProductCurrencyStepComponent,
    SavingProductTermsStepComponent,
    SavingProductSettingsStepComponent,
    SavingProductChargesStepComponent,
    SavingProductAccountingStepComponent,
    SavingProductPreviewStepComponent
  ]
})
export class CreateSavingProductComponent {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private router = inject(Router);
  private settingsService = inject(SettingsService);
  private accounting = inject(Accounting);

  @ViewChild(SavingProductDetailsStepComponent, { static: true })
  savingProductDetailsStep: SavingProductDetailsStepComponent;
  @ViewChild(SavingProductCurrencyStepComponent, { static: true })
  savingProductCurrencyStep: SavingProductCurrencyStepComponent;
  @ViewChild(SavingProductTermsStepComponent, { static: true }) savingProductTermsStep: SavingProductTermsStepComponent;
  @ViewChild(SavingProductSettingsStepComponent, { static: true })
  savingProductSettingsStep: SavingProductSettingsStepComponent;
  @ViewChild(SavingProductChargesStepComponent, { static: true })
  savingProductChargesStep: SavingProductChargesStepComponent;
  @ViewChild(SavingProductAccountingStepComponent, { static: true })
  savingProductAccountingStep: SavingProductAccountingStepComponent;

  savingProductsTemplate: any;
  accountingRuleData: string[] = [];

  /**
   * @param {ActivatedRoute} route Activated Route.
   * @param {ProductsService} productsService Products Service.
   * @param {Router} router Router for navigation.
   * @param {SettingsService} settingsService Settings Service.
   */

  constructor() {
    this.route.data.subscribe((data: { savingProductsTemplate: any }) => {
      this.savingProductsTemplate = data.savingProductsTemplate;
    });
    this.accountingRuleData = this.accounting.getAccountingRulesForSavings();
  }

  get savingProductDetailsForm() {
    return this.savingProductDetailsStep.savingProductDetailsForm;
  }

  get savingProductCurrencyForm() {
    return this.savingProductCurrencyStep.savingProductCurrencyForm;
  }

  get savingProductTermsForm() {
    return this.savingProductTermsStep.savingProductTermsForm;
  }

  get savingProductSettingsForm() {
    return this.savingProductSettingsStep.savingProductSettingsForm;
  }

  get savingProductAccountingForm() {
    return this.savingProductAccountingStep.savingProductAccountingForm;
  }

  get savingProductFormValid() {
    return (
      this.savingProductDetailsForm.valid &&
      this.savingProductCurrencyForm.valid &&
      this.savingProductTermsForm.valid &&
      this.savingProductSettingsForm.valid &&
      this.savingProductAccountingForm.valid
    );
  }

  get savingProduct() {
    const savingProduct = {
      ...this.savingProductDetailsStep.savingProductDetails,
      ...this.savingProductCurrencyStep.savingProductCurrency,
      ...this.savingProductTermsStep.savingProductTerms,
      ...this.savingProductSettingsStep.savingProductSettings,
      ...this.savingProductChargesStep.savingProductCharges,
      ...this.savingProductAccountingStep.savingProductAccounting
    };
    return {
      ...savingProduct,
      charges: this.ensureEarlyWithdrawalChargeAttached(
        savingProduct.charges || [],
        savingProduct.earlyWithdrawalPenaltyEnabled,
        savingProduct.earlyWithdrawalChargeId
      )
    };
  }

  prepareSavingProductPayload(savingProduct: any): any {
    const payload = {
      ...savingProduct,
      charges: savingProduct.charges.map((charge: any) => ({ id: charge.id })),
      locale: this.settingsService.language.code // locale required for nominalAnnualInterestRate
    };
    if (!payload.earlyWithdrawalPenaltyEnabled && this.hasEarlyWithdrawalPayload(payload)) {
      payload.earlyWithdrawalChargeId = null;
      payload.earlyWithdrawalChargeMode = null;
    }
    delete payload.advancedAccountingRules;
    return payload;
  }

  private ensureEarlyWithdrawalChargeAttached(charges: any[], enabled: boolean, chargeId: any): any[] {
    if (!enabled || !chargeId || charges.some((charge: any) => this.sameChargeId(charge.id, chargeId))) {
      return charges;
    }
    const earlyWithdrawalCharge = this.findTemplateCharge(chargeId);
    return earlyWithdrawalCharge ? charges.concat([earlyWithdrawalCharge]) : charges;
  }

  private findTemplateCharge(chargeId: any): any {
    return [
      ...(this.savingProductsTemplate.charges || []),
      ...(this.savingProductsTemplate.chargeOptions || []),
      ...(this.savingProductsTemplate.penaltyOptions || [])
    ].find((charge: any) => this.sameChargeId(charge.id, chargeId));
  }

  private sameChargeId(first: any, second: any): boolean {
    return String(first) === String(second);
  }

  private hasEarlyWithdrawalPayload(payload: any): boolean {
    return (
      Object.prototype.hasOwnProperty.call(payload, 'earlyWithdrawalPenaltyEnabled') ||
      Object.prototype.hasOwnProperty.call(payload, 'earlyWithdrawalChargeId') ||
      Object.prototype.hasOwnProperty.call(payload, 'earlyWithdrawalChargeMode')
    );
  }

  submit() {
    // TODO: Update once language and date settings are setup
    const savingProduct = this.prepareSavingProductPayload(this.savingProduct);
    this.productsService.createSavingProduct(savingProduct).subscribe((response: any) => {
      this.router.navigate(
        [
          '../',
          response.resourceId
        ],
        { relativeTo: this.route }
      );
    });
  }
}
