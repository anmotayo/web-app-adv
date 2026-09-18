/** Angular Imports */
import { Component, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Components */
import { DynamicDepositProductDetailsStepComponent } from '../dynamic-deposit-product-stepper/dynamic-deposit-product-details-step/dynamic-deposit-product-details-step.component';
import { DynamicDepositProductCurrencyStepComponent } from '../dynamic-deposit-product-stepper/dynamic-deposit-product-currency-step/dynamic-deposit-product-currency-step.component';
import { DynamicDepositProductTermsStepComponent } from '../dynamic-deposit-product-stepper/dynamic-deposit-product-terms-step/dynamic-deposit-product-terms-step.component';
import { DynamicDepositProductSettingsStepComponent } from '../dynamic-deposit-product-stepper/dynamic-deposit-product-settings-step/dynamic-deposit-product-settings-step.component';
import { DynamicDepositProductInterestRateChartStepComponent } from '../dynamic-deposit-product-stepper/dynamic-deposit-product-interest-rate-chart-step/dynamic-deposit-product-interest-rate-chart-step.component';
import { DynamicDepositProductChargesStepComponent } from '../dynamic-deposit-product-stepper/dynamic-deposit-product-charges-step/dynamic-deposit-product-charges-step.component';
import { DynamicDepositProductAccountingStepComponent } from '../dynamic-deposit-product-stepper/dynamic-deposit-product-accounting-step/dynamic-deposit-product-accounting-step.component';

/** Custom Services */
import { ProductsService } from 'app/products/products.service';
import { SettingsService } from 'app/settings/settings.service';
import { MatStepper, MatStepperIcon, MatStep, MatStepLabel } from '@angular/material/stepper';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DynamicDepositProductPreviewStepComponent } from '../dynamic-deposit-product-stepper/dynamic-deposit-product-preview-step/dynamic-deposit-product-preview-step.component';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { Accounting } from 'app/core/utils/accounting';

@Component({
  selector: 'mifosx-create-dynamic-deposit-product',
  templateUrl: './create-dynamic-deposit-product.component.html',
  styleUrls: ['./create-dynamic-deposit-product.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatStepper,
    MatStepperIcon,
    FaIconComponent,
    MatStep,
    MatStepLabel,
    DynamicDepositProductDetailsStepComponent,
    DynamicDepositProductCurrencyStepComponent,
    DynamicDepositProductTermsStepComponent,
    DynamicDepositProductSettingsStepComponent,
    DynamicDepositProductInterestRateChartStepComponent,
    DynamicDepositProductChargesStepComponent,
    DynamicDepositProductAccountingStepComponent,
    DynamicDepositProductPreviewStepComponent
  ]
})
export class CreateDynamicDepositProductComponent {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private router = inject(Router);
  private settingsService = inject(SettingsService);
  private accounting = inject(Accounting);

  @ViewChild(DynamicDepositProductDetailsStepComponent, { static: true })
  dynamicDepositProductDetailsStep: DynamicDepositProductDetailsStepComponent;
  @ViewChild(DynamicDepositProductCurrencyStepComponent, { static: true })
  dynamicDepositProductCurrencyStep: DynamicDepositProductCurrencyStepComponent;
  @ViewChild(DynamicDepositProductTermsStepComponent, { static: true })
  dynamicDepositProductTermsStep: DynamicDepositProductTermsStepComponent;
  @ViewChild(DynamicDepositProductSettingsStepComponent, { static: true })
  dynamicDepositProductSettingsStep: DynamicDepositProductSettingsStepComponent;
  @ViewChild(DynamicDepositProductInterestRateChartStepComponent, { static: true })
  dynamicDepositProductInterestRateChartStep: DynamicDepositProductInterestRateChartStepComponent;
  @ViewChild(DynamicDepositProductChargesStepComponent, { static: true })
  dynamicDepositProductChargesStep: DynamicDepositProductChargesStepComponent;
  @ViewChild(DynamicDepositProductAccountingStepComponent, { static: true })
  dynamicDepositProductAccountingStep: DynamicDepositProductAccountingStepComponent;

  dynamicDepositProductsTemplate: any;
  accountingRuleData: string[] = [];

  /**
   * @param {ActivatedRoute} route Activated Route.
   * @param {ProductsService} productsService Products Service.
   * @param {Router} router Router for navigation.
   * @param {SettingsService} settingsService Settings Service.
   */

  constructor() {
    this.route.data.subscribe((data: { dynamicDepositProductsTemplate: any }) => {
      this.dynamicDepositProductsTemplate = data.dynamicDepositProductsTemplate;
    });
    this.accountingRuleData = this.accounting.getAccountingRulesForSavings();
  }

  get dynamicDepositProductDetailsForm() {
    return this.dynamicDepositProductDetailsStep.dynamicDepositProductDetailsForm;
  }

  get dynamicDepositProductCurrencyForm() {
    return this.dynamicDepositProductCurrencyStep.dynamicDepositProductCurrencyForm;
  }

  get dynamicDepositProductTermsForm() {
    return this.dynamicDepositProductTermsStep.dynamicDepositProductTermsForm;
  }

  get dynamicDepositProductSettingsForm() {
    return this.dynamicDepositProductSettingsStep.dynamicDepositProductSettingsForm;
  }

  get dynamicDepositProductInterestRateChartForm() {
    return this.dynamicDepositProductInterestRateChartStep.dynamicDepositProductInterestRateChartForm;
  }

  get dynamicDepositProductAccountingForm() {
    return this.dynamicDepositProductAccountingStep.dynamicDepositProductAccountingForm;
  }

  get dynamicDepositProductFormValid() {
    return (
      this.dynamicDepositProductDetailsForm.valid &&
      this.dynamicDepositProductCurrencyForm.valid &&
      this.dynamicDepositProductTermsForm.valid &&
      this.dynamicDepositProductSettingsForm.valid &&
      this.dynamicDepositProductInterestRateChartForm.valid &&
      this.dynamicDepositProductAccountingForm.valid
    );
  }

  get dynamicDepositProduct() {
    return {
      ...this.dynamicDepositProductDetailsStep.dynamicDepositProductDetails,
      ...this.dynamicDepositProductCurrencyStep.dynamicDepositProductCurrency,
      ...this.dynamicDepositProductTermsStep.dynamicDepositProductTerms,
      ...this.dynamicDepositProductSettingsStep.dynamicDepositProductSettings,
      ...this.dynamicDepositProductInterestRateChartStep.dynamicDepositProductInterestRateChart,
      ...this.dynamicDepositProductChargesStep.dynamicDepositProductCharges,
      ...this.dynamicDepositProductAccountingStep.dynamicDepositProductAccounting
    };
  }

  prepareDynamicDepositProductPayload(dynamicDepositProduct: any): any {
    const charges = this.ensureEarlyWithdrawalChargeAttached(
      dynamicDepositProduct.charges || [],
      dynamicDepositProduct.earlyWithdrawalPenaltyEnabled,
      dynamicDepositProduct.earlyWithdrawalChargeId
    );
    const payload = {
      ...dynamicDepositProduct,
      charges: charges.map((charge: any) => ({ id: charge.id })),
      locale: this.settingsService.language.code
    };
    if (!payload.earlyWithdrawalPenaltyEnabled) {
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
      ...(this.dynamicDepositProductsTemplate.charges || []),
      ...(this.dynamicDepositProductsTemplate.chargeOptions || []),
      ...(this.dynamicDepositProductsTemplate.penaltyOptions || [])
    ].find((charge: any) => this.sameChargeId(charge.id, chargeId));
  }

  private sameChargeId(first: any, second: any): boolean {
    return String(first) === String(second);
  }

  submit() {
    // TODO: Update once language and date settings are setup
    const dynamicDepositProduct = this.prepareDynamicDepositProductPayload(this.dynamicDepositProduct);
    this.productsService.createDynamicDepositProduct(dynamicDepositProduct).subscribe((response: any) => {
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
