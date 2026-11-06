import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { CloseDynamicDepositsAccountComponent } from './close-dynamic-deposits-account.component';
import { DynamicDepositsService } from '../../dynamic-deposits.service';
import { SettingsService } from 'app/settings/settings.service';
import { Dates } from 'app/core/utils/dates';

describe('CloseDynamicDepositsAccountComponent', () => {
  const template = {
    savingsAccounts: [{ id: 99, accountNo: '000099' }],
    onAccountClosureOptions: [
      { id: 100, value: 'Withdraw Deposit' },
      { id: 200, value: 'Transfer to Savings' },
      { id: 300, value: 'Reinvest Principal and Interest' },
      { id: 400, value: 'Reinvest Principal Only' }
    ],
    maturityAmount: 1050,
    depositAmount: 1000,
    maturityDate: [
      2026,
      7,
      1
    ],
    linkedAccountNo: '000000077'
  };

  let service: { executeDynamicDepositsAccountCommand: jest.Mock };
  let router: { navigate: jest.Mock; navigateByUrl: jest.Mock; url: string };
  let route: any;
  let component: CloseDynamicDepositsAccountComponent;

  beforeEach(() => {
    service = { executeDynamicDepositsAccountCommand: jest.fn() };
    router = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn(),
      url: '/clients/3/dynamic-deposits-accounts/7/actions/Close'
    };
    route = {
      data: of({ dynamicDepositsAccountActionData: template }),
      parent: { snapshot: { params: { dynamicDepositAccountId: '7' } } }
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: DynamicDepositsService, useValue: service },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
        {
          provide: SettingsService,
          useValue: { businessDate: new Date(2026, 6, 1), language: { code: 'en' }, dateFormat: 'dd MMMM yyyy' }
        },
        {
          provide: Dates,
          useValue: { formatDate: jest.fn(() => '01 July 2026'), parseDate: jest.fn(() => new Date(2026, 6, 1)) }
        }
      ]
    }).overrideComponent(CloseDynamicDepositsAccountComponent, { set: { template: '', imports: [] } });
    component = TestBed.createComponent(CloseDynamicDepositsAccountComponent).componentInstance;
    component.ngOnInit();
  });

  const choose = (id: number) => component.closeOnMaturityAccountForm.get('onAccountClosureId').setValue(id);

  it('cannot be closed before the maturity date', () => {
    expect(component.minDate).toEqual(new Date(2026, 6, 1));
  });

  it('reinvesting principal and interest reinvests the whole maturity amount', () => {
    choose(300);

    expect(component.reinvestAmount).toBe(1050);
    expect(component.reinvestsPrincipalOnly).toBe(false);
  });

  it('reinvesting the principal only reinvests the amount invested and shows the interest less tax that goes on to the linked account', () => {
    choose(400);

    expect(component.reinvestAmount).toBe(1000);
    expect(component.reinvestsPrincipalOnly).toBe(true);
    expect(component.interestLessTax).toBe(50);
    expect(component.linkedAccountNo).toBe('000000077');
  });

  it('shows no interest split when the principal and interest are reinvested together', () => {
    choose(400);
    choose(300);

    expect(component.reinvestsPrincipalOnly).toBe(false);
    expect(component.interestLessTax).toBeNull();
  });

  it('never reinvests more than the maturity amount', () => {
    component.depositAmount = 5000;

    choose(400);

    expect(component.reinvestAmount).toBe(1050);
  });

  it('shows no reinvest amount for a withdrawal or a transfer', () => {
    choose(300);
    choose(100);
    expect(component.reinvestAmount).toBeNull();
    expect(component.interestLessTax).toBeNull();

    choose(200);
    expect(component.reinvestAmount).toBeNull();
    expect(component.closeOnMaturityAccountForm.contains('toSavingsAccountId')).toBe(true);
    expect(component.closeOnMaturityAccountForm.contains('transferDescription')).toBe(true);

    choose(300);
    expect(component.closeOnMaturityAccountForm.contains('toSavingsAccountId')).toBe(false);
  });

  it('opens the reinvested deposit, not the closed one, after a reinvestment', () => {
    service.executeDynamicDepositsAccountCommand.mockReturnValue(of({ changes: { reinvestedDepositId: 808 } }));
    component.closeOnMaturityAccountForm.patchValue({ closedOnDate: new Date(2026, 6, 1) });
    choose(300);

    component.submit();

    expect(service.executeDynamicDepositsAccountCommand).toHaveBeenCalledWith(
      '7',
      'close',
      expect.objectContaining({ onAccountClosureId: 300, closedOnDate: '01 July 2026' })
    );
    expect(router.navigateByUrl).toHaveBeenCalledWith('/clients/3/dynamic-deposits-accounts/808');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('returns to the account after a closure that reinvested nothing', () => {
    service.executeDynamicDepositsAccountCommand.mockReturnValue(of({ changes: {} }));
    component.closeOnMaturityAccountForm.patchValue({ closedOnDate: new Date(2026, 6, 1) });
    choose(100);

    component.submit();

    expect(router.navigate).toHaveBeenCalledWith(['../../'], { relativeTo: route });
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
