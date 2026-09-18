import { AccountsFilterPipe } from './accounts-filter.pipe';

describe('AccountsFilterPipe', () => {
  let pipe: AccountsFilterPipe;

  beforeEach(() => {
    pipe = new AccountsFilterPipe();
  });

  it('includes submitted, approved and active dynamic deposit accounts in open savings filters', () => {
    const accounts = [
      {
        accountNo: 'submitted',
        depositType: { id: 500 },
        status: { code: 'savingsAccountStatusType.submitted.and.pending.approval' }
      },
      {
        accountNo: 'approved',
        depositType: { code: 'depositAccountType.dynamicDeposit' },
        status: { code: 'savingsAccountStatusType.approved' }
      },
      {
        accountNo: 'active',
        depositType: { value: 'Dynamic Deposit' },
        status: { code: 'savingsAccountStatusType.active' }
      },
      {
        accountNo: 'closed',
        depositType: { id: 500 },
        status: { code: 'savingsAccountStatusType.closed' }
      },
      {
        accountNo: 'savings',
        depositType: { id: 100, code: 'depositAccountType.savingsDeposit', value: 'Savings' },
        status: { code: 'savingsAccountStatusType.active' }
      }
    ];

    const filteredAccounts = pipe.transform(accounts, 'saving', 'open', 'isDynamic');

    expect(filteredAccounts.map((account: any) => account.accountNo)).toEqual([
      'submitted',
      'approved',
      'active'
    ]);
  });
});
