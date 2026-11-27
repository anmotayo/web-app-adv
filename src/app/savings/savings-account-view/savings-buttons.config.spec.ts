import { describe, expect, it } from '@jest/globals';
import { SavingsButtonsConfiguration } from './savings-buttons.config';

describe('SavingsButtonsConfiguration', () => {
  it('uses the backend permission names for block and unblock deposit and withdrawal actions', () => {
    const availableActions = new SavingsButtonsConfiguration('Active', {
      block: false,
      blockCredit: false,
      blockDebit: false
    }).singleButtons;
    const blockedActions = new SavingsButtonsConfiguration('Active', {
      block: false,
      blockCredit: true,
      blockDebit: true
    }).singleButtons;

    expect(availableActions.find((action) => action.name === 'Block Deposit')?.taskPermissionName).toBe(
      'BLOCKCREDIT_SAVINGSACCOUNT'
    );
    expect(availableActions.find((action) => action.name === 'Block Withdrawal')?.taskPermissionName).toBe(
      'BLOCKDEBIT_SAVINGSACCOUNT'
    );
    expect(blockedActions.find((action) => action.name === 'Unblock Deposit')?.taskPermissionName).toBe(
      'UNBLOCKCREDIT_SAVINGSACCOUNT'
    );
    expect(blockedActions.find((action) => action.name === 'Unblock Withdrawal')?.taskPermissionName).toBe(
      'UNBLOCKDEBIT_SAVINGSACCOUNT'
    );
  });
});
