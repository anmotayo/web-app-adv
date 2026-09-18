/** Angular Imports */
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { SavingsService } from 'app/savings/savings.service';
import { DynamicDepositsService } from '../dynamic-deposits.service';

/**
 * Dynamic Deposits Account Actions data resolver.
 */
@Injectable()
export class DynamicDepositsAccountActionsResolver {
  private savingsService = inject(SavingsService);
  private dynamicDepositsService = inject(DynamicDepositsService);

  /**
   * Returns the Fixed deposits account actions data.
   * @param {ActivatedRouteSnapshot} route Route Snapshot
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const actionName = route.paramMap.get('name');
    const dynamicDepositAccountId =
      route.paramMap.get('dynamicDepositAccountId') || route.parent.parent.paramMap.get('dynamicDepositAccountId');
    switch (actionName) {
      case 'Add Charge':
        return this.savingsService.getSavingsChargeTemplateResource(dynamicDepositAccountId);
      case 'Close':
        return this.dynamicDepositsService.getDynamicDepositsAccountClosureTemplate(dynamicDepositAccountId);
      case 'Deposit':
      case 'Withdrawal':
        return this.dynamicDepositsService.getDynamicDepositsAccountTransactionTemplate(
          dynamicDepositAccountId,
          actionName.toLocaleLowerCase() as 'deposit' | 'withdrawal'
        );
      default:
        return undefined;
    }
  }
}
