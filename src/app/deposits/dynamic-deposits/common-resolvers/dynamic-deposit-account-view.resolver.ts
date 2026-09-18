/** Angular Imports */
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { DynamicDepositsService } from 'app/deposits/dynamic-deposits/dynamic-deposits.service';

/**
 * Dynamic Deposits Account data resolver.
 */
@Injectable()
export class DynamicDepositsAccountViewResolver {
  private dynamicDepositsService = inject(DynamicDepositsService);

  /**
   * Returns the Dynamic Deposits Account data.
   * @param {ActivatedRouteSnapshot} route Route Snapshot
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const dynamicDepositAccountId = route.paramMap.get('dynamicDepositAccountId');
    return this.dynamicDepositsService.getDynamicDepositsAccountData(dynamicDepositAccountId);
  }
}
