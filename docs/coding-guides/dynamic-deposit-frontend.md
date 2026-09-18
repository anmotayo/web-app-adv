# Dynamic Deposit Frontend Conventions

Dynamic Deposit screens should follow the Fixed Deposit and Recurring Deposit modules rather than introducing a new architecture. Keep the cloned module shape, Angular Material controls, routed account tabs, and existing `layout-row` / `layout-column` / `flex-*` utility classes.

## Product And Account Modules

- Product screens live under `src/app/products/dynamic-deposit-products` and mirror the fixed-deposit product flow.
- Account screens live under `src/app/deposits/dynamic-deposits` and mirror the fixed-deposit account flow.
- Use `DynamicDepositsService` for Dynamic Deposit REST calls:
  - `/dynamicdepositproducts`
  - `/dynamicdepositaccounts`
  - `/dynamicdepositaccounts/{accountId}/interest-summary`
  - `/dynamicdepositaccounts/{accountId}/transactions?command=deposit|withdrawal`
- Account tabs are routed children rendered through `mat-tab-nav-bar` and `router-outlet`.

## Load-Bearing Rules

- `allowWithdrawal === false` hides or disables regular withdrawal, regular transfer-out, and premature-close/manual withdrawal paths.
- `allowWithdrawal === false` must not disable `transferInterestToSavings`. Transfer-interest-to-savings is governed by the linked-savings-account requirement only.
- Deposit/top-up, transfer-in, calculate interest, post interest, and configured transfer-interest-to-savings remain available when withdrawals are disabled.
- Interest-based charges are deducted from interest, not principal. Label them clearly and do not show a manual Pay Charge action for those charges.

## Display Safety

Dynamic Deposit account reads may be leaner than the Fixed Deposit DTOs. New templates should use optional-safe reads for cloned FD fields such as `summary`, `transactions`, `charges`, `linkedAccount`, `accountChart`, and currency fields.

Use `savingsProductName || depositProductName` for product-name display because the backend may expose either name while the response DTO is being aligned.

## Translations

Add static user-facing copy to `src/assets/translations/en-US.json` in the section the template references (`labels.inputs`, `labels.heading`, `labels.buttons`, or `labels.menus`). Run a JSON parse check after edits.
