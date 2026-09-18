import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SavingsService } from 'app/savings/savings.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicDepositNotesResolver {
  private savingsService = inject(SavingsService);

  /**
   * Returns notes for the Dynamic Deposit account's savings-backed resource.
   * @returns {Observable<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const dynamicDepositAccountId =
      route.parent.paramMap.get('dynamicDepositAccountId') ||
      route.parent.parent.paramMap.get('dynamicDepositAccountId');
    return this.savingsService.getSavingsNotes(dynamicDepositAccountId);
  }
}
