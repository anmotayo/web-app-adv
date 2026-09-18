import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Currency } from 'app/shared/models/general.model';
import { CurrencyPipe } from '@angular/common';
import { ExternalIdentifierComponent } from '../../../../shared/external-identifier/external-identifier.component';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';
import { YesnoPipe } from '../../../../pipes/yesno.pipe';
import { DynamicDepositsService } from '../../dynamic-deposits.service';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-general-tab',
  templateUrl: './general-tab.component.html',
  styleUrls: ['./general-tab.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    ExternalIdentifierComponent,
    CurrencyPipe,
    DateFormatPipe,
    YesnoPipe
  ]
})
export class GeneralTabComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dynamicDepositsService = inject(DynamicDepositsService);

  dynamicDepositsAccountData: any;
  interestSummary: any;
  entityType: string;
  currency: Currency;

  constructor() {
    this.route.parent.data.subscribe((data: { dynamicDepositsAccountData: any }) => {
      this.dynamicDepositsAccountData = data.dynamicDepositsAccountData;
      this.currency = this.dynamicDepositsAccountData.currency || {};
      this.loadInterestSummary();
    });
    if (this.router.url.includes('clients')) {
      this.entityType = 'Client';
    } else if (this.router.url.includes('groups')) {
      this.entityType = 'Group';
    } else if (this.router.url.includes('centers')) {
      this.entityType = 'Center';
    }
  }

  private loadInterestSummary() {
    if (!this.dynamicDepositsAccountData?.id) {
      return;
    }
    this.dynamicDepositsService
      .getDynamicDepositsAccountInterestSummary(this.dynamicDepositsAccountData.id)
      .subscribe((summary: any) => {
        this.interestSummary = summary;
      });
  }

  get totalInterestEarned(): number {
    return this.amount(
      this.interestSummary?.totalInterestEarned ??
        this.interestSummary?.grossInterestEarnedAsAtToday ??
        this.dynamicDepositsAccountData?.summary?.totalInterestEarned
    );
  }

  get totalInterestPosted(): number {
    return this.amount(
      this.interestSummary?.interestPosted ?? this.dynamicDepositsAccountData?.summary?.totalInterestPosted
    );
  }

  get totalInterestWithdrawn(): number {
    return this.amount(
      this.interestSummary?.interestWithdrawn ?? this.dynamicDepositsAccountData?.summary?.totalInterestWithdrawn
    );
  }

  get totalWithholdingTax(): number {
    return this.amount(
      this.interestSummary?.withholdingTax ?? this.dynamicDepositsAccountData?.summary?.totalWithholdingTax
    );
  }

  get totalInterestBasedChargeAccrued(): number {
    return this.amount(
      this.dynamicDepositsAccountData?.interestBasedChargeDerived ??
        this.interestSummary?.interestBasedChargeDerived ??
        this.interestSummary?.interestBasedCharges
    );
  }

  get totalInterestBasedChargeForfeited(): number {
    return this.amount(
      this.dynamicDepositsAccountData?.interestBasedChargePostedDerived ??
        this.interestSummary?.interestBasedChargePostedDerived ??
        this.interestSummary?.interestBasedChargePosted ??
        this.interestSummary?.interestBasedChargesPosted
    );
  }

  get netInterest(): number {
    return this.totalInterestEarned - this.totalInterestBasedChargeForfeited - this.totalWithholdingTax;
  }

  private amount(value: any): number {
    return Number(value) || 0;
  }
}
