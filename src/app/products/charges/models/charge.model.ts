import { Currency, PaymentTypeOption } from 'app/shared/models/general.model';
import { OptionData } from 'app/shared/models/option-data.model';

export interface Charge {
  id: number;
  name: string;
  active: boolean;
  penalty: boolean;
  freeWithdrawal: boolean;
  freeWithdrawalChargeFrequency: number;
  restartFrequency: number;
  restartFrequencyEnum: number;
  isPaymentType: boolean;
  currency: Currency;
  amount: number;
  chargeTimeType: OptionData;
  chargeAppliesTo: OptionData;
  chargeCalculationType: OptionData;
  chargePaymentMode: OptionData;
  interestBasisMode?: OptionData;
  customPeriodReapplyPolicy?: OptionData;
  interestBasisModeOptions?: OptionData[];
  customPeriodReapplyPolicyOptions?: OptionData[];
  feeInterval?: number;
  feeFrequency?: OptionData;
  feeOnMonthDay?: number[];
  paymentTypeOptions?: PaymentTypeOption;
}

export const WITHDRAWAL_FEE_CHARGE_TIME_TYPE_ID = 5;
export const SAVINGS_CHARGE_APPLIES_TO_TYPE_ID = 2;
export const PERCENT_OF_INTEREST_CHARGE_CALCULATION_TYPE_ID = 4;
export const CUSTOM_PERIOD_INTEREST_BASIS_MODE_ID = 2;
export const DEFAULT_INTEREST_BASIS_MODE_OPTIONS: OptionData[] = [
  { id: 1, code: 'advancly.interestBasisMode.cumulative', value: 'Cumulative' },
  { id: 2, code: 'advancly.interestBasisMode.customPeriod', value: 'Custom Period' }
];
export const DEFAULT_CUSTOM_PERIOD_REAPPLY_POLICY_OPTIONS: OptionData[] = [
  {
    id: 1,
    code: 'advancly.customPeriodReapplyPolicy.oncePerSelectedPeriod',
    value: 'Once Per Selected Period'
  },
  {
    id: 2,
    code: 'advancly.customPeriodReapplyPolicy.untilSelectedPeriodInterestExhausted',
    value: 'Until Selected Period Interest Exhausted'
  }
];

export enum ChargeAppliesToCode {
  ChargeAppliesToClient = 'chargeAppliesTo.client',
  ChargeAppliesToLoan = 'chargeAppliesTo.loan',
  ChargeAppliesToSavings = 'chargeAppliesTo.savings',
  ChargeAppliesToShares = 'chargeAppliesTo.shares',
  ChargeCalculationTypeFlat = 'chargeCalculationType.flat',
  ChargeCalculationTypePercentOfAmount = 'chargeCalculationType.percent.of.amount',
  ChargeCalculationTypePercentOfAmountAndInterest = 'chargeCalculationType.percent.of.amount.and.interest',
  ChargeCalculationTypePercentOfInterest = 'chargeCalculationType.percent.of.interest',
  ChargeTimeTypeActivation = 'chargeTimeType.activation',
  ChargeTimeTypeAnnualFee = 'chargeTimeType.annualFee',
  ChargeTimeTypeDisbursement = 'chargeTimeType.disbursement',
  ChargeTimeTypeInstalmentFee = 'chargeTimeType.instalmentFee',
  ChargeTimeTypeMonthlyFee = 'chargeTimeType.monthlyFee',
  ChargeTimeTypeOverdueInstallment = 'chargeTimeType.overdueInstallment',
  ChargeTimeTypeSavingsActivation = 'chargeTimeType.savingsActivation',
  ChargeTimeTypeSavingsNoActivityFee = 'chargeTimeType.savingsNoActivityFee',
  ChargeTimeTypeSharespurchase = 'chargeTimeType.sharespurchase',
  ChargeTimeTypeSharesredeem = 'chargeTimeType.sharesredeem',
  ChargeTimeTypeSolidarityFund = 'chargeTimeType.solidarityFund',
  ChargeTimeTypeSpecifiedDueDate = 'chargeTimeType.specifiedDueDate',
  ChargeTimeTypeWeeklyFee = 'chargeTimeType.weeklyFee',
  ChargeTimeTypeWithdrawalFee = 'chargeTimeType.withdrawalFee',
  ChargepaymentmodeAccounttransfer = 'chargepaymentmode.accounttransfer',
  ChargepaymentmodeRegular = 'chargepaymentmode.regular',
  FeeFrequencyperiodFrequencyTypeMonths = 'feeFrequencyperiodFrequencyType.months'
}
