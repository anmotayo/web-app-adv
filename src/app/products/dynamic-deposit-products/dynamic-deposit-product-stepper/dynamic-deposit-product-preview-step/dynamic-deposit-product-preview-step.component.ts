import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, inject } from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { Accounting } from 'app/core/utils/accounting';
import { OptionData } from 'app/shared/models/option-data.model';
import { MatDivider } from '@angular/material/divider';

import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow
} from '@angular/material/table';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ViewSavingsAccountingDetailsComponent } from '../../../../shared/accounting/view-savings-accounting-details/view-savings-accounting-details.component';
import { MatStepperPrevious } from '@angular/material/stepper';
import { FindPipe } from '../../../../pipes/find.pipe';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';
import { FormatNumberPipe } from '../../../../pipes/format-number.pipe';
import { YesnoPipe } from '../../../../pipes/yesno.pipe';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-dynamic-deposit-product-preview-step',
  templateUrl: './dynamic-deposit-product-preview-step.component.html',
  styleUrls: ['./dynamic-deposit-product-preview-step.component.scss'],
  animations: [
    trigger('expandChartSlab', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatDivider,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FaIconComponent,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    ViewSavingsAccountingDetailsComponent,
    MatStepperPrevious,
    FindPipe,
    DateFormatPipe,
    FormatNumberPipe,
    YesnoPipe
  ]
})
export class DynamicDepositProductPreviewStepComponent implements OnInit, OnChanges {
  private accounting = inject(Accounting);

  @Input() dynamicDepositProductsTemplate: any;
  @Input() chartSlabsDisplayedColumns: any[];
  @Input() accountingRuleData: any;
  @Input() dynamicDepositProduct: any;
  @Output() submitEvent = new EventEmitter();

  chartSlabsIncentivesDisplayedColumns: string[] = ['incentives'];
  incentivesDisplayedColumns: string[] = [
    'entityType',
    'attributeName',
    'conditionType',
    'attributeValue',
    'incentiveType',
    'amount'
  ];
  chargesDisplayedColumns: string[] = [
    'name',
    'chargeCalculationType',
    'amount',
    'chargeTimeType'
  ];
  paymentFundSourceDisplayedColumns: string[] = [
    'paymentTypeId',
    'fundSourceAccountId'
  ];
  feesPenaltyIncomeDisplayedColumns: string[] = [
    'chargeId',
    'incomeAccountId'
  ];

  expandChartSlabIndex: number[] = [];

  accountingMappings: any = {};
  accountingRule: OptionData;

  ngOnInit() {
    this.setCurrentValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setCurrentValues();
  }

  setCurrentValues(): void {
    if (!this.dynamicDepositProduct || !this.dynamicDepositProductsTemplate) {
      return;
    }

    const accountingRule = this.dynamicDepositProduct.accountingRule || 1;
    this.accountingRule = this.accounting.getAccountingRuleFrom(accountingRule);
    this.accountingMappings = {};

    if (this.accounting.isCashOrAccrualAccountingRuleId(accountingRule)) {
      const accountingMappingOptions = this.dynamicDepositProductsTemplate.accountingMappingOptions || {};
      const assetAccountData = accountingMappingOptions.assetAccountOptions || [];
      const incomeAccountData = accountingMappingOptions.incomeAccountOptions || [];
      const expenseAccountData = accountingMappingOptions.expenseAccountOptions || [];
      const liabilityAccountData = accountingMappingOptions.liabilityAccountOptions || [];

      this.accountingMappings = {
        savingsReferenceAccount: this.accounting.glAccountLookUp(
          this.dynamicDepositProduct.savingsReferenceAccountId,
          assetAccountData
        ),
        savingsControlAccount: this.accounting.glAccountLookUp(
          this.dynamicDepositProduct.savingsControlAccountId,
          liabilityAccountData
        ),
        transfersInSuspenseAccount: this.accounting.glAccountLookUp(
          this.dynamicDepositProduct.transfersInSuspenseAccountId,
          liabilityAccountData
        ),
        interestOnSavingsAccount: this.accounting.glAccountLookUp(
          this.dynamicDepositProduct.interestOnSavingsAccountId,
          expenseAccountData
        ),
        incomeFromFeeAccount: this.accounting.glAccountLookUp(
          this.dynamicDepositProduct.incomeFromFeeAccountId,
          incomeAccountData
        ),
        incomeFromPenaltyAccount: this.accounting.glAccountLookUp(
          this.dynamicDepositProduct.incomeFromPenaltyAccountId,
          incomeAccountData
        )
      };

      if (this.isAccrualAccounting()) {
        this.accountingMappings['feeReceivableAccount'] = this.accounting.glAccountLookUp(
          this.dynamicDepositProduct.feesReceivableAccountId,
          assetAccountData
        );
        this.accountingMappings['penaltyReceivableAccount'] = this.accounting.glAccountLookUp(
          this.dynamicDepositProduct.penaltiesReceivableAccountId,
          assetAccountData
        );
        this.accountingMappings['interestPayableAccount'] = this.accounting.glAccountLookUp(
          this.dynamicDepositProduct.interestPayableAccountId,
          liabilityAccountData
        );
      }
    }
  }

  isNoneAccounting(): boolean {
    return this.accounting.isNoneAccountingRuleId(this.dynamicDepositProduct?.accountingRule || 1);
  }

  isCashOrAccrualAccounting(): boolean {
    return this.accounting.isCashOrAccrualAccountingRuleId(this.dynamicDepositProduct?.accountingRule);
  }

  isAccrualAccounting(): boolean {
    return this.accounting.isAccrualAccountingRuleId(this.dynamicDepositProduct?.accountingRule);
  }

  earlyWithdrawalChargeName(chargeId: any): string {
    const charge = this.findCharge(chargeId);
    return charge ? charge.name : '';
  }

  earlyWithdrawalChargeModeLabel(mode: any): string {
    if (mode === null || mode === undefined || mode === '') {
      return '';
    }
    const modeOption = (this.dynamicDepositProductsTemplate?.earlyWithdrawalChargeModeOptions || []).find(
      (option: any) => String(option.id) === String(mode)
    );
    return modeOption ? modeOption.value : '';
  }

  isInterestBasedCharge(charge: any): boolean {
    const calculationType = charge?.chargeCalculationType || {};
    const calculationTypeText = `${calculationType.code || ''} ${calculationType.value || ''}`.toLowerCase();
    return (
      calculationType.id === 4 ||
      calculationTypeText.includes('percent.of.interest') ||
      calculationTypeText.includes('% interest') ||
      calculationTypeText.includes('percent of interest')
    );
  }

  private findCharge(chargeId: any): any {
    return [
      ...(this.dynamicDepositProduct.charges || []),
      ...(this.dynamicDepositProductsTemplate.chargeOptions || []),
      ...(this.dynamicDepositProductsTemplate.penaltyOptions || [])
    ].find((charge: any) => String(charge.id) === String(chargeId));
  }
}
