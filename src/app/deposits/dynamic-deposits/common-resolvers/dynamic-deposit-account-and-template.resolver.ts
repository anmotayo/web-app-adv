/** Angular Imports */
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';

/** Custom Services */
import { DynamicDepositsService } from '../dynamic-deposits.service';

/**
 * Dynamic Deposits Account Template resolver.
 */
@Injectable()
export class DynamicDepositsAccountAndTemplateResolver {
  private dynamicDepositsService = inject(DynamicDepositsService);

  /**
   * Returns the Dynamic Deposits Account Template.
   * @param {ActivatedRouteSnapshot} route Route Snapshot
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const dynamicDepositAccountId = route.paramMap.get('dynamicDepositAccountId');
    return this.dynamicDepositsService.getDynamicDepositsAccountAndTemplate(dynamicDepositAccountId);
  }
}
