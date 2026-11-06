# Dynamic Deposit Frontend Shipping Checklist

Use this before shipping Dynamic Deposit frontend changes.

## Product Screens

- Dynamic Deposit product list/create/edit/view routes render.
- Product settings include `allowWithdrawal`, `dynamicRateEnabled`, and early-withdrawal penalty fields.
- Early-withdrawal charge copy makes clear the charge is deducted from interest.
- Product preview and general view show Dynamic Deposit-specific settings.

## Account Screens

- Dynamic Deposit account creation and edit routes render.
- `transferInterestToSavings` remains usable when `allowWithdrawal` is false, as long as a linked savings account is selected.
- Active accounts with `allowWithdrawal === false` hide withdrawal, transfer-out, and premature close actions.
- Deposit/top-up, calculate interest, post interest, and transfer-interest-to-savings remain available when withdrawals are disabled.
- Interest Summary loads from `/dynamicdepositaccounts/{accountId}/interest-summary`.
- Rate History uses `effectiveRateIntervals` from the interest summary response.
- Interest-based charges are labeled and do not show manual Pay Charge.
- Client general tab shows open and closed Dynamic Deposit accounts.

## Backend Contract To Confirm

The frontend is defensive, but the account read API should eventually expose:

- `allowWithdrawal`
- `dynamicRateEnabled`
- `transferInterestToSavings`
- `linkAccountId` or `linkedAccount`
- `savingsProductName` or `depositProductName`
- `currency`
- `summary`
- `transactions`
- `charges`

The interest-summary API should expose:

- `grossInterestEarnedAsAtToday`
- `interestPosted`
- `totalInterestForPeriod`
- `interestWithdrawn`
- `withholdingTax`
- `interestBasedCharges`
- `interestBasedChargeDerived`
- `interestBasedChargePostedDerived`
- `netInterest`
- `interestTransferredToSavings`
- `effectiveRateIntervals`

## Verification

- Run `npm run build`.
- Run `npm run lint` when time permits; this repo may have existing lint debt, so record pre-existing failures separately from Dynamic Deposit failures.
- Manually walk product create/edit/view and account create/edit/view for both `allowWithdrawal = true` and `allowWithdrawal = false`.
