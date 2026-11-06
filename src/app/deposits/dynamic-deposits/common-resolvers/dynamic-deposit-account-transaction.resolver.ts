/** Angular Imports */
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { DynamicDepositsService } from '../dynamic-deposits.service';

/**
 * Dynamic Deposits Account Transaction data resolver.
 */
@Injectable()
export class DynamicDepositsAccountTransactionResolver {
  private dynamicDepositsService = inject(DynamicDepositsService);

  /**
   * Returns the Dynamic Deposits Account Transaction data.
   * @param {ActivatedRouteSnapshot} route Route Snapshot
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const dynamicDepositAccountId = route.parent.paramMap.get('dynamicDepositAccountId');
    const transactionId = route.paramMap.get('id');
    return this.dynamicDepositsService.getDynamicDepositsAccountTransaction(dynamicDepositAccountId, transactionId);
  }
}
