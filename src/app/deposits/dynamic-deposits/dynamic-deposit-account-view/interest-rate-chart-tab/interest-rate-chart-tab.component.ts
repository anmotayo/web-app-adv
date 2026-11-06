import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
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
import { CurrencyPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';
import { FormatNumberPipe } from '../../../../pipes/format-number.pipe';
import { DynamicDepositsService } from '../../dynamic-deposits.service';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Dynamic Deposit Interest Rate Chart / Rate History Tab.
 */
@Component({
  selector: 'mifosx-interest-rate-chart-tab',
  templateUrl: './interest-rate-chart-tab.component.html',
  styleUrls: ['./interest-rate-chart-tab.component.scss'],
  animations: [
    trigger('expandChartSlab', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
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
    FaIconComponent,
    CurrencyPipe,
    DateFormatPipe,
    FormatNumberPipe
  ]
})
export class InterestRateChartTabComponent {
  private route = inject(ActivatedRoute);
  private dynamicDepositsService = inject(DynamicDepositsService);

  dynamicDepositsAccountData: any;
  effectiveRateIntervals: any[] = [];
  displayedColumns: string[] = [
    'transactionDate',
    'investedAmountAfterTransaction',
    'resolvedAnnualInterestRate',
    'rateSource'
  ];
  /** Bound interest rate chart slabs (snapshotted at account creation). */
  chartSlabs: any[] = [];
  chartSlabsDisplayedColumns: string[] = [
    'period',
    'amountRange',
    'interest',
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
  chartSlabsIncentivesDisplayedColumns: string[] = ['incentives'];
  expandChartSlabIndex: number;

  constructor() {
    this.route.parent.data.subscribe((data: { dynamicDepositsAccountData: any }) => {
      this.dynamicDepositsAccountData = data.dynamicDepositsAccountData;
      this.chartSlabs = this.dynamicDepositsAccountData?.chart?.chartSlabs || [];
      this.loadRateHistory();
    });
  }

  private loadRateHistory() {
    if (!this.dynamicDepositsAccountData?.id) {
      return;
    }
    this.dynamicDepositsService
      .getDynamicDepositsAccountInterestSummary(this.dynamicDepositsAccountData.id)
      .subscribe((summary: any) => {
        this.effectiveRateIntervals = summary?.effectiveRateIntervals || [];
      });
  }
}
