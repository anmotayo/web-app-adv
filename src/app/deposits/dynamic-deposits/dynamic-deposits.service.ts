/** Angular Imports */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

/** rxjs Imports */
import { forkJoin, map, Observable } from 'rxjs';

const DYNAMIC_DEPOSIT_PERIOD_FREQUENCY_OPTIONS = [
  { id: 0, code: 'deposit.period.savingsPeriodFrequencyType.days', value: 'Days' },
  { id: 1, code: 'deposit.period.savingsPeriodFrequencyType.weeks', value: 'Weeks' },
  { id: 2, code: 'deposit.period.savingsPeriodFrequencyType.months', value: 'Months' },
  { id: 3, code: 'deposit.period.savingsPeriodFrequencyType.years', value: 'Years' }
];

/**
 * Dynamic Deposits Service.
 */
@Injectable({
  providedIn: 'root'
})
export class DynamicDepositsService {
  private http = inject(HttpClient);

  /**
   * @param accountId Account Id.
   * @returns {Observable<any>} Dynamic Deposits data.
   */
  getDynamicDepositsAccountData(accountId: string): Observable<any> {
    const httpParams = new HttpParams().set('associations', 'all');
    return this.http.get(`/dynamicdepositaccounts/${accountId}`, { params: httpParams });
  }

  /**
   * @param {string} accountId dynamic deposits account Id
   * @returns {Observable<any>}
   */
  deleteDynamicDepositsAccount(accountId: string): Observable<any> {
    return this.http.delete(`/dynamicdepositaccounts/${accountId}`);
  }

  /**
   * @param {string} accountId Account Id
   * @param {string} command Command
   * @param {any} data Data
   * @returns {Observable<any>}
   */
  executeDynamicDepositsAccountCommand(accountId: string, command: string, data: any): Observable<any> {
    const httpParams = new HttpParams().set('command', command);
    return this.http.post(`/dynamicdepositaccounts/${accountId}`, data, { params: httpParams });
  }

  /**
   * @param {string} accountId Dynamic Deposits Account Id
   * @param {string} transactionId Transaction Id
   * @returns {Observable<any>}
   */
  getDynamicDepositsAccountTransaction(accountId: string, transactionId: string): Observable<any> {
    return this.http.get(`/dynamicdepositaccounts/${accountId}/transactions/${transactionId}`);
  }

  /**
   * @param {string} accountId Dynamic Deposits Account Id
   * @param {string} command Command
   * @param {any} data Data
   * @param {string} transactionId Transaction Id
   * @returns {Observable<any>}
   */
  executeDynamicDepositsAccountTransactionsCommand(
    accountId: string,
    command: string,
    data: any,
    transactionId?: any
  ): Observable<any> {
    const httpParams = new HttpParams().set('command', command);
    if (transactionId) {
      return this.http.post(`/dynamicdepositaccounts/${accountId}/transactions/${transactionId}`, data, {
        params: httpParams
      });
    }
    return this.http.post(`/dynamicdepositaccounts/${accountId}/transactions`, data, { params: httpParams });
  }

  /**
   * @param {string} accountId Dynamic Deposits Account Id
   * @returns {Observable<any>}
   */
  getDynamicDepositsAccountClosureTemplate(accountId: string): Observable<any> {
    const httpParams = new HttpParams().set('command', 'close');
    return this.http.get(`/dynamicdepositaccounts/${accountId}/template`, { params: httpParams });
  }

  /**
   * @param {string} accountId Dynamic Deposits Account Id
   * @returns {Observable<any>}
   */
  getDynamicDepositsAccountTransactionTemplate(accountId: string, command: 'deposit' | 'withdrawal'): Observable<any> {
    const httpParams = new HttpParams().set('command', command);
    return this.http.get(`/dynamicdepositaccounts/${accountId}/transactions/template`, { params: httpParams });
  }

  /**
   * @param clientId Client Id assosciated with dynamic deposits account.
   * @returns {Observable<any>} Dynamic Deposits account template.
   */
  getDynamicDepositsAccountTemplate(clientId: string, productId?: string): Observable<any> {
    let httpParams = new HttpParams().set('clientId', clientId);
    httpParams = productId ? httpParams.set('productId', productId) : httpParams;
    return this.http.get('/dynamicdepositaccounts/template', { params: httpParams });
  }

  /**
   * @param clientId Client Id associated with the dynamic deposit account.
   * @param productId Dynamic Deposit Product Id.
   * @returns {Observable<any>} Product template enriched with client savings accounts for account creation.
   */
  getDynamicDepositsAccountProductTemplate(clientId: string, productId: string): Observable<any> {
    const productParams = new HttpParams().set('template', 'true');
    return forkJoin({
      product: this.http.get(`/dynamicdepositproducts/${productId}`, { params: productParams }),
      clientAccounts: this.http.get(`/clients/${clientId}/accounts`)
    }).pipe(
      map(({ product, clientAccounts }: { product: any; clientAccounts: any }) => {
        const charts = product.charts || [];
        return {
          ...product,
          accountChart: charts.length ? charts[0] : product.chartTemplate,
          fieldOfficerOptions: product.fieldOfficerOptions || [],
          savingsAccounts: clientAccounts.savingsAccounts || [],
          periodFrequencyTypeOptions: product.periodFrequencyTypeOptions || DYNAMIC_DEPOSIT_PERIOD_FREQUENCY_OPTIONS,
          lockinPeriodFrequencyTypeOptions:
            product.lockinPeriodFrequencyTypeOptions || DYNAMIC_DEPOSIT_PERIOD_FREQUENCY_OPTIONS,
          chargeOptions: product.chargeOptions || product.charges || []
        };
      })
    );
  }

  /**
   * @param accountId Dynamic Deposits Account Id
   * @returns {Observable<any>} Dynamic Deposit interest summary.
   */
  getDynamicDepositsAccountInterestSummary(accountId: string): Observable<any> {
    return this.http.get(`/dynamicdepositaccounts/${accountId}/interest-summary`);
  }

  /**
   * @param {string} accountId Dynamic Deposits Account Id
   * @returns {Observable<any>}
   */
  getDynamicDepositsAccountAndTemplate(accountId: any) {
    const httpParams = new HttpParams().set('associations', 'charges,linkedAccount').set('template', 'true');
    return this.http.get(`/dynamicdepositaccounts/${accountId}`, { params: httpParams });
  }

  /**
   * @param dynamicDepositAccount Dynamic Deposit Account
   * @returns {Observable<any>}
   */
  createDynamicDepositAccount(dynamicDepositAccount: any): Observable<any> {
    return this.http.post(`/dynamicdepositaccounts`, dynamicDepositAccount);
  }

  /**
   * @param {any} accountId Account Id
   * @param {any} dynamicDepositAccount Dynamic Deposit Account
   * @returns {Observable<any>}
   */
  updateDynamicDepositAccount(accountId: any, dynamicDepositAccount: any): Observable<any> {
    return this.http.put(`/dynamicdepositaccounts/${accountId}`, dynamicDepositAccount);
  }

  /**
   * @param clientId Client Id
   * @param clientName Client Name
   * @param fromAccountId Account Id
   * @param locale Locale
   * @param dateFormat Date Format
   * @returns {Observable<any>} Standing Instructions
   */
  getStandingInstructions(
    clientId: string,
    clientName: string,
    fromAccountId: string,
    locale: string,
    dateFormat: string
  ): Observable<any> {
    const httpParams = new HttpParams()
      .set('clientId', clientId)
      .set('clientName', clientName)
      .set('fromAccountId', fromAccountId)
      .set('fromAccountType', '2')
      .set('locale', locale)
      .set('dateFormat', dateFormat);
    return this.http.get(`/standinginstructions`, { params: httpParams });
  }
}
