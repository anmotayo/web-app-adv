import { describe, it, expect } from '@jest/globals';
import { DynamicDepositsButtonsConfiguration } from './dynamic-deposits-buttons.config';

const names = (config: DynamicDepositsButtonsConfiguration) => config.singleButtons.map((button) => button.name);

describe('DynamicDepositsButtonsConfiguration', () => {
  // A Dynamic Deposit never reaches a `Matured` status, so an active account has to offer the closure that the backend
  // will accept for its maturity date: it refuses a premature close from the maturity date on, and a close before it.
  it('offers Premature Close, not Close, to an active account that has not matured', () => {
    const buttons = names(new DynamicDepositsButtonsConfiguration('Active', false));

    expect(buttons).toContain('Premature Close');
    expect(buttons).not.toContain('Close');
  });

  it('offers Close, not Premature Close, to an active account that has matured', () => {
    const buttons = names(new DynamicDepositsButtonsConfiguration('Active', true));

    expect(buttons).toContain('Close');
    expect(buttons).not.toContain('Premature Close');
  });

  it('keeps the other active-account actions whichever closure it offers', () => {
    for (const isMatured of [
      false,
      true
    ]) {
      const buttons = names(new DynamicDepositsButtonsConfiguration('Active', isMatured));

      expect(buttons).toEqual(
        expect.arrayContaining([
          'Deposit',
          'Withdrawal',
          'Calculate Interest',
          'Undo Activation'
        ])
      );
    }
  });

  it('treats a missing maturity flag as not matured', () => {
    expect(names(new DynamicDepositsButtonsConfiguration('Active'))).toContain('Premature Close');
  });

  it('does not change the buttons of any other status', () => {
    expect(names(new DynamicDepositsButtonsConfiguration('Approved', true))).toEqual([
      'Undo Approval',
      'Activate'
    ]);
    expect(names(new DynamicDepositsButtonsConfiguration('Matured', false))).toEqual([
      'Close',
      'Calculate Interest'
    ]);
  });
});
