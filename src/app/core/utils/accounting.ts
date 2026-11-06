import { Injectable } from '@angular/core';
import { AccountingMapping, GLAccount } from 'app/shared/models/general.model';
import { OptionData } from 'app/shared/models/option-data.model';

@Injectable({
  providedIn: 'root'
})
export class Accounting {
  public getAccountingRulesForShares(): string[] {
    return [
      'NONE',
      'Cash'
    ];
  }

  public getAccountingRulesForSavings(): string[] {
    return [
      'NONE',
      'Cash',
      'Accrual (periodic)'
    ];
  }

  public getAccountingRulesForLoans(): string[] {
    return [
      'NONE',
      'Cash',
      'Accrual (periodic)',
      'Accrual (upfront)'
    ];
  }

  public getAccountRuleName(value: string): string {
    if ([
        'ACCRUAL PERIODIC',
        'ACCRUAL (PERIODIC)'
      ].includes(value)) {
      return 'Accrual (periodic)';
    } else if ([
        'ACCRUAL UPFRONT',
        'ACCRUAL (UPFRONT)'
      ].includes(value)) {
      return 'Accrual (upfront)';
    } else if (value.startsWith('CASH')) {
      return 'Cash';
    } else if (value === 'NONE') {
      return 'NONE';
    }
    return '';
  }

  public isNoneAccounting(accountingRule: OptionData): boolean {
    return this.getAccountingRuleId(accountingRule) === 1;
  }

  public isNoneAccountingRuleId(accountingRule: any): boolean {
    return this.getAccountingRuleId(accountingRule) === 1;
  }

  public isCashOrAccrualAccounting(accountingRule: OptionData): boolean {
    const accountingRuleId = this.getAccountingRuleId(accountingRule);
    return accountingRuleId === 2 || accountingRuleId === 3;
  }

  public isCashOrAccrualAccountingRuleId(accountingRuleId: any): boolean {
    accountingRuleId = this.getAccountingRuleId(accountingRuleId);
    return accountingRuleId === 2 || accountingRuleId === 3;
  }

  public isAccrualAccounting(accountingRule: OptionData): boolean {
    return this.getAccountingRuleId(accountingRule) === 3;
  }

  public isAccrualAccountingRuleId(accountingRuleId: any): boolean {
    return this.getAccountingRuleId(accountingRuleId) === 3;
  }

  public getAccountingRuleId(accountingRule: any, fallbackAccountingRuleId: number = 1): number {
    const accountingRuleId = this.getNumericAccountingRuleId(accountingRule);
    if (accountingRuleId) {
      return accountingRuleId;
    }

    if (accountingRule && typeof accountingRule === 'object') {
      const objectAccountingRuleId = this.getNumericAccountingRuleId(accountingRule.id);
      if (objectAccountingRuleId) {
        return objectAccountingRuleId;
      }
      return this.getAccountingRuleIdFromText(accountingRule.value || accountingRule.code, fallbackAccountingRuleId);
    }

    return this.getAccountingRuleIdFromText(accountingRule, fallbackAccountingRuleId);
  }

  public getAccountingRuleFrom(accountingRule: any): OptionData {
    const accountingRuleId = this.getAccountingRuleId(accountingRule);
    if (accountingRuleId === 1) {
      return { code: 'NONE', id: accountingRuleId, value: 'None' };
    } else if (accountingRuleId === 2) {
      return { code: 'CASH', id: accountingRuleId, value: 'Cash' };
    } else if (accountingRuleId === 3) {
      return { code: 'ACCRUAL_PERIODIC', id: accountingRuleId, value: 'Accural (periodic)' };
    } else if (accountingRuleId === 4) {
      return { code: 'ACCRUAL_UPFRONT', id: accountingRuleId, value: 'Accural (upfront)' };
    }
    return { code: 'INVALID', id: accountingRuleId, value: 'Invalid' };
  }

  private getNumericAccountingRuleId(accountingRule: any): number | null {
    const accountingRuleId = Number(accountingRule);
    return Number.isFinite(accountingRuleId) && accountingRuleId > 0 ? accountingRuleId : null;
  }

  private getAccountingRuleIdFromText(accountingRule: any, fallbackAccountingRuleId: number): number {
    if (typeof accountingRule !== 'string') {
      return fallbackAccountingRuleId;
    }

    const normalizedAccountingRule = accountingRule.toUpperCase();
    if (normalizedAccountingRule.includes('ACCRUAL') && normalizedAccountingRule.includes('UPFRONT')) {
      return 4;
    }
    if (normalizedAccountingRule.includes('ACCRUAL') && normalizedAccountingRule.includes('PERIODIC')) {
      return 3;
    }
    if (normalizedAccountingRule.includes('CASH')) {
      return 2;
    }
    if (normalizedAccountingRule.includes('NONE')) {
      return 1;
    }

    return fallbackAccountingRuleId;
  }

  public glAccountLookUp(glAccountId: number, glAccounts: GLAccount[]): AccountingMapping {
    let accountMapping: AccountingMapping | null = null;
    if (glAccountId) {
      glAccounts.some((glAccount: GLAccount) => {
        if (glAccount.id === glAccountId) {
          accountMapping = { id: glAccount.id, name: glAccount.name, glCode: glAccount.glCode };
        }
      });
    }
    return accountMapping;
  }
}
