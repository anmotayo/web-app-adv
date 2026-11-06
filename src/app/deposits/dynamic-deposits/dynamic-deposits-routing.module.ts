/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Custom Components */
import { DynamicDepositAccountViewComponent } from './dynamic-deposit-account-view/dynamic-deposit-account-view.component';
import { InterestRateChartTabComponent } from './dynamic-deposit-account-view/interest-rate-chart-tab/interest-rate-chart-tab.component';
import { TransactionsTabComponent } from './dynamic-deposit-account-view/transactions-tab/transactions-tab.component';
import { ChargesTabComponent } from './dynamic-deposit-account-view/charges-tab/charges-tab.component';
import { StandingInstructionsTabComponent } from './dynamic-deposit-account-view/standing-instructions-tab/standing-instructions-tab.component';
import { DatatableTabsComponent } from './dynamic-deposit-account-view/datatable-tabs/datatable-tabs.component';
import { DynamicDepositsAccountActionsComponent } from './dynamic-deposits-account-actions/dynamic-deposits-account-actions.component';
import { ViewTransactionComponent } from './dynamic-deposit-account-view/view-transaction/view-transaction.component';
import { CreateDynamicDepositAccountComponent } from './create-dynamic-deposit-account/create-dynamic-deposit-account.component';
import { EditDynamicDepositAccountComponent } from './edit-dynamic-deposit-account/edit-dynamic-deposit-account.component';
import { NotesTabComponent } from './dynamic-deposit-account-view/notes-tab/notes-tab.component';

/** Custom Resolvers */
import { DynamicDepositsAccountViewResolver } from './common-resolvers/dynamic-deposit-account-view.resolver';
import { DynamicDepositNotesResolver } from './common-resolvers/dynamic-deposit-notes.resolver';
import { SavingsDatatableResolver } from 'app/savings/common-resolvers/savings-datatable.resolver';
import { SavingsDatatablesResolver } from 'app/savings/common-resolvers/savings-datatables.resolver';
import { DynamicDepositsAccountTransactionResolver } from './common-resolvers/dynamic-deposit-account-transaction.resolver';
import { DynamicDepositsAccountActionsResolver } from './common-resolvers/dynamic-deposit-account-actions.resolver';
import { DynamicDepositsAccountTemplateResolver } from './common-resolvers/dynamic-deposit-account-template.resolver';
import { DynamicDepositsAccountAndTemplateResolver } from './common-resolvers/dynamic-deposit-account-and-template.resolver';
import { GeneralTabComponent } from './dynamic-deposit-account-view/general-tab/general-tab.component';

const routes: Routes = [
  {
    path: '',
    data: { title: 'All Dynamic Deposits', breadcrumb: 'Dynamic Deposits', routeParamBreadcrumb: false },
    children: [
      {
        path: 'create',
        data: { title: 'Create Dynamic Deposit Account', breadcrumb: 'Create Dynamic Deposit Account' },
        component: CreateDynamicDepositAccountComponent,
        resolve: {
          dynamicDepositsAccountTemplate: DynamicDepositsAccountTemplateResolver
        }
      },
      {
        path: ':dynamicDepositAccountId',
        data: { title: 'Dynamic Deposit Account View', routeParamBreadcrumb: 'dynamicDepositAccountId' },
        resolve: {
          dynamicDepositsAccountData: DynamicDepositsAccountViewResolver
        },
        children: [
          {
            path: '',
            component: DynamicDepositAccountViewComponent,
            resolve: {
              dynamicDepositsAccountData: DynamicDepositsAccountViewResolver,
              savingsDatatables: SavingsDatatablesResolver
            },
            children: [
              {
                path: '',
                redirectTo: 'general',
                pathMatch: 'full'
              },
              {
                path: 'general',
                component: GeneralTabComponent,
                data: { title: 'Dynamic Deposit Account Details', breadcrumb: 'General', routeParamBreadcrumb: false }
              },
              {
                path: 'rate-history',
                component: InterestRateChartTabComponent,
                data: {
                  title: 'Dynamic Deposit Account Rate History',
                  breadcrumb: 'Rate History',
                  routeParamBreadcrumb: false
                }
              },
              {
                path: 'interest-rate-chart',
                redirectTo: 'rate-history',
                pathMatch: 'full'
              },
              {
                path: 'transactions',
                component: TransactionsTabComponent,
                data: {
                  title: 'Dynamic Deposit Account Transactions',
                  breadcrumb: 'Transactions',
                  routeParamBreadcrumb: false
                }
              },
              {
                path: 'charges',
                component: ChargesTabComponent,
                data: { title: 'Dynamic Deposit Account Charges', breadcrumb: 'Charges', routeParamBreadcrumb: false }
              },
              {
                path: 'notes',
                component: NotesTabComponent,
                data: { title: 'Dynamic Deposit Account Notes', breadcrumb: 'Notes', routeParamBreadcrumb: false },
                resolve: {
                  dynamicDepositAccountNotes: DynamicDepositNotesResolver
                }
              },
              {
                path: 'standing-instructions',
                component: StandingInstructionsTabComponent,
                data: {
                  title: 'Dynamic Deposit Account Standing Instructions',
                  breadcrumb: 'Standing Instructions',
                  routeParamBreadcrumb: false
                }
              },
              {
                path: 'datatables',
                children: [
                  {
                    path: ':datatableName',
                    component: DatatableTabsComponent,
                    data: { title: 'View Data Table', routeParamBreadcrumb: 'datatableName' },
                    resolve: {
                      savingsDatatable: SavingsDatatableResolver
                    }
                  }
                ]
              }
            ]
          },
          {
            path: 'edit',
            data: { title: 'Edit Dynamic Deposit Account', breadcrumb: 'Edit', routeParamBreadcrumb: false },
            component: EditDynamicDepositAccountComponent,
            resolve: {
              dynamicDepositsAccountAndTemplate: DynamicDepositsAccountAndTemplateResolver
            }
          },
          {
            path: 'transactions',
            data: {
              title: 'Dynamic Deposits Account Transactions',
              breadcrumb: 'Transactions',
              routeParamBreadcrumb: false
            },
            children: [
              {
                path: '',
                redirectTo: '../transactions',
                pathMatch: 'prefix'
              },
              {
                path: 'account-transfers',
                loadChildren: () =>
                  import('../../account-transfers/account-transfers.module').then((m) => m.AccountTransfersModule)
              },
              {
                path: ':id',
                data: { routeParamBreadcrumb: 'id' },
                children: [
                  {
                    path: '',
                    component: ViewTransactionComponent,
                    resolve: {
                      dynamicDepositsAccountTransaction: DynamicDepositsAccountTransactionResolver
                    }
                  }
                ]
              }
            ]
          },
          {
            path: 'actions/:name',
            data: { title: 'Dynamic Deposits Account Actions', routeParamBreadcrumb: 'name' },
            component: DynamicDepositsAccountActionsComponent,
            resolve: {
              dynamicDepositsAccountActionData: DynamicDepositsAccountActionsResolver
            }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    DynamicDepositsAccountViewResolver,
    SavingsDatatableResolver,
    SavingsDatatablesResolver,
    DynamicDepositsAccountTransactionResolver,
    DynamicDepositsAccountActionsResolver,
    DynamicDepositsAccountTemplateResolver,
    DynamicDepositsAccountAndTemplateResolver,
    DynamicDepositNotesResolver
  ]
})
export class DynamicDepositsRoutingModule {}
