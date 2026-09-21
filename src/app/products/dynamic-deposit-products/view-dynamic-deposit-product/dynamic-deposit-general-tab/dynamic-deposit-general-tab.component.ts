import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
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
import { ViewSavingsAccountingDetailsComponent } from '../../../../shared/accounting/view-savings-accounting-details/view-savings-accounting-details.component';
import { FindPipe } from '../../../../pipes/find.pipe';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';
import { FormatNumberPipe } from '../../../../pipes/format-number.pipe';
import { YesnoPipe } from '../../../../pipes/yesno.pipe';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-dynamic-deposit-general-tab',
  templateUrl: './dynamic-deposit-general-tab.component.html',
  styleUrls: ['./dynamic-deposit-general-tab.component.scss'],
  animations: [
    trigger('expandChartSlab', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    FaIconComponent,
    MatDivider,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    ViewSavingsAccountingDetailsComponent,
    FindPipe,
    DateFormatPipe,
    FormatNumberPipe,
    YesnoPipe
  ]
})
export class DynamicDepositGeneralTabComponent {
  private route = inject(ActivatedRoute);

  /** Dynamic Deposit Product data. */
  dynamicDepositProductData: any;
  dynamicDepositProductsTemplate: any;

  chartSlabsIncentivesDisplayedColumns: string[] = ['incentives'];
  chartSlabsDisplayedColumns: string[] = [
    'period',
    'amountRange',
    'annualInterestRate',
    'description',
    'actions'
  ];
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
    'type',
    'amount',
    'collectedon'
  ];
  paymentFundSourceDisplayedColumns: string[] = [
    'paymentTypeId',
    'fundSourceAccountId'
  ];
  feesPenaltyIncomeDisplayedColumns: string[] = [
    'chargeId',
    'incomeAccountId'
  ];

  /**
   * Retrieves the fixed deposit product data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor() {
    this.route.data.subscribe((data: { dynamicDepositProduct: any; dynamicDepositProductsTemplate?: any }) => {
      this.dynamicDepositProductData = data.dynamicDepositProduct || {};
      this.dynamicDepositProductsTemplate = data.dynamicDepositProductsTemplate || data.dynamicDepositProduct || {};
    });
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
}
