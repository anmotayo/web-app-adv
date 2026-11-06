import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { PrematureCloseDynamicDepositsAccountComponent } from './premature-close-dynamic-deposits-account.component';
import { DynamicDepositsService } from '../../dynamic-deposits.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';

describe('PrematureCloseDynamicDepositsAccountComponent', () => {
  const preview = {
    maturityAmount: 1005,
    depositAmount: 1000,
    interestPosted: 10,
    withholdTax: 1,
    forfeitureApplicable: true,
    forfeitureAmount: 4.5,
    forfeiturePercentage: 50,
    forfeitureChargeName: 'Early withdrawal penalty',
    savingsAccounts: [{ id: 99, accountNo: '000099' }],
    onAccountClosureOptions: [
      { id: 100, value: 'Withdraw Deposit' },
      { id: 200, value: 'Transfer to Savings' }
    ]
  };

  let service: { executeDynamicDepositsAccountCommand: jest.Mock };
  let router: { navigate: jest.Mock };
  let route: any;
  let component: PrematureCloseDynamicDepositsAccountComponent;

  beforeEach(() => {
    // The percentage preview is debounced; fake timers let a test wait it out without sleeping.
    jest.useFakeTimers();
    service = { executeDynamicDepositsAccountCommand: jest.fn(() => of(preview)) };
    router = { navigate: jest.fn() };
    route = { parent: { snapshot: { params: { dynamicDepositAccountId: '7' } } } };
    TestBed.configureTestingModule({
      providers: [
        { provide: DynamicDepositsService, useValue: service },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
        {
          provide: SettingsService,
          useValue: { businessDate: new Date(2026, 0, 20), language: { code: 'en' }, dateFormat: 'dd MMMM yyyy' }
        },
        { provide: Dates, useValue: { formatDate: jest.fn(() => '20 January 2026') } }
      ]
    }).overrideComponent(PrematureCloseDynamicDepositsAccountComponent, { set: { template: '', imports: [] } });
    component = TestBed.createComponent(PrematureCloseDynamicDepositsAccountComponent).componentInstance;
    component.ngOnInit();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const form = () => component.prematureCloseAccountForm;
  const previewCalls = () =>
    service.executeDynamicDepositsAccountCommand.mock.calls.filter((call) => call[1] === 'calculatePrematureAmount');

  it('previews what closing on the chosen date pays out, without a percentage override unless one is entered', () => {
    form()
      .get('closedOnDate')
      .setValue(new Date(2026, 0, 20));

    expect(previewCalls()).toHaveLength(1);
    expect(previewCalls()[0][2]).toEqual({ closedOnDate: '20 January 2026', dateFormat: 'dd MMMM yyyy', locale: 'en' });
    expect(component.preview).toBe(preview);
    expect(form().get('maturityAmount').value).toBe(1005);
  });

  it('adds the closure controls once, however many times the preview refreshes', () => {
    form()
      .get('closedOnDate')
      .setValue(new Date(2026, 0, 19));
    form()
      .get('closedOnDate')
      .setValue(new Date(2026, 0, 20));
    form().get('onAccountClosureId').setValue(200);
    form().get('onAccountClosureId').setValue(100);
    form().get('onAccountClosureId').setValue(200);

    expect(previewCalls()).toHaveLength(2);
    expect(form().contains('toSavingsAccountId')).toBe(true);
    form().get('onAccountClosureId').setValue(100);
    expect(form().contains('toSavingsAccountId')).toBe(false);
    expect(form().contains('transferDescription')).toBe(false);
  });

  it('re-runs the preview with the percentage once typing has paused', () => {
    form()
      .get('closedOnDate')
      .setValue(new Date(2026, 0, 20));

    form().get('earlyWithdrawalChargePercentage').setValue(25);
    jest.advanceTimersByTime(100);
    expect(previewCalls()).toHaveLength(1);
    jest.advanceTimersByTime(400);

    expect(previewCalls()).toHaveLength(2);
    expect(previewCalls()[1][2]).toEqual(expect.objectContaining({ earlyWithdrawalChargePercentage: 25 }));
  });

  it('does not preview with a percentage outside 0 to 100', () => {
    form()
      .get('closedOnDate')
      .setValue(new Date(2026, 0, 20));

    form().get('earlyWithdrawalChargePercentage').setValue(101);
    jest.advanceTimersByTime(400);

    expect(previewCalls()).toHaveLength(1);
  });

  it('has nothing to confirm when the backend refuses the date', () => {
    form()
      .get('closedOnDate')
      .setValue(new Date(2026, 0, 20));
    service.executeDynamicDepositsAccountCommand.mockReturnValue(throwError(() => new Error('on or after maturity')));

    form()
      .get('closedOnDate')
      .setValue(new Date(2026, 0, 21));

    expect(component.preview).toBeUndefined();
  });

  it('submits the closure with the percentage only when one was entered, and never the displayed amount', () => {
    form()
      .get('closedOnDate')
      .setValue(new Date(2026, 0, 20));
    form().get('onAccountClosureId').setValue(100);
    service.executeDynamicDepositsAccountCommand.mockReturnValue(of({}));

    component.submit();

    const closeCall = service.executeDynamicDepositsAccountCommand.mock.calls.find(
      (call) => call[1] === 'prematureClose'
    );
    expect(closeCall[2]).toEqual({
      closedOnDate: '20 January 2026',
      onAccountClosureId: 100,
      note: '',
      dateFormat: 'dd MMMM yyyy',
      locale: 'en'
    });
    expect(router.navigate).toHaveBeenCalledWith(['../../'], { relativeTo: route });
  });

  it('sends the percentage override with the closure when one was entered', () => {
    form()
      .get('closedOnDate')
      .setValue(new Date(2026, 0, 20));
    form().get('earlyWithdrawalChargePercentage').setValue(25);
    jest.advanceTimersByTime(400);
    form().get('onAccountClosureId').setValue(100);
    service.executeDynamicDepositsAccountCommand.mockReturnValue(of({}));

    component.submit();

    const closeCall = service.executeDynamicDepositsAccountCommand.mock.calls.find(
      (call) => call[1] === 'prematureClose'
    );
    expect(closeCall[2]).toEqual(expect.objectContaining({ earlyWithdrawalChargePercentage: 25 }));
  });
});
