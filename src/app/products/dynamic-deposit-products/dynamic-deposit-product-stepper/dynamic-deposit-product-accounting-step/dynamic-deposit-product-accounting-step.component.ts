import { Component, Input, OnInit, inject } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { FormDialogComponent } from 'app/shared/form-dialog/form-dialog.component';

import { TranslateService } from '@ngx-translate/core';
import { Accounting } from 'app/core/utils/accounting';
import { FormfieldBase } from 'app/shared/form-dialog/formfield/model/formfield-base';
import { SelectBase } from 'app/shared/form-dialog/formfield/model/select-base';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatDivider } from '@angular/material/divider';
import { GlAccountSelectorComponent } from '../../../../shared/accounting/gl-account-selector/gl-account-selector.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow
} from '@angular/material/table';
import { MatStepperPrevious, MatStepperNext } from '@angular/material/stepper';
import { FindPipe } from '../../../../pipes/find.pipe';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-dynamic-deposit-product-accounting-step',
  templateUrl: './dynamic-deposit-product-accounting-step.component.html',
  styleUrls: ['./dynamic-deposit-product-accounting-step.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatRadioGroup,
    MatRadioButton,
    MatDivider,
    GlAccountSelectorComponent,
    MatCheckbox,
    FaIconComponent,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIconButton,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatStepperPrevious,
    MatStepperNext,
    FindPipe
  ]
})
export class DynamicDepositProductAccountingStepComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  dialog = inject(MatDialog);
  private accounting = inject(Accounting);
  private translateService = inject(TranslateService);

  @Input() dynamicDepositProductsTemplate: any;
  @Input() accountingRuleData: any;
  @Input() dynamicDepositProductFormValid: boolean;

  dynamicDepositProductAccountingForm: UntypedFormGroup;

  chargeData: any;
  penaltyData: any;
  paymentTypeData: any;
  assetAccountData: any;
  incomeAccountData: any;
  expenseAccountData: any;
  liabilityAccountData: any;

  paymentFundSourceDisplayedColumns: string[] = [
    'paymentTypeId',
    'fundSourceAccountId',
    'actions'
  ];
  feesPenaltyIncomeDisplayedColumns: string[] = [
    'chargeId',
    'incomeAccountId',
    'actions'
  ];
  private readonly baseAccountingControlNames = [
    'savingsReferenceAccountId',
    'savingsControlAccountId',
    'transfersInSuspenseAccountId',
    'interestOnSavingsAccountId',
    'incomeFromFeeAccountId',
    'incomeFromPenaltyAccountId'
  ];
  private readonly accrualAccountingControlNames = [
    'feesReceivableAccountId',
    'penaltiesReceivableAccountId',
    'interestPayableAccountId'
  ];
  private readonly advancedAccountingControlNames = [
    'paymentChannelToFundSourceMappings',
    'feeToIncomeAccountMappings',
    'penaltyToIncomeAccountMappings'
  ];

  constructor() {
    this.createdynamicDepositProductAccountingForm();
    this.setConditionalControls();
  }

  ngOnInit() {
    this.chargeData = this.dynamicDepositProductsTemplate.chargeOptions || [];
    this.penaltyData = this.dynamicDepositProductsTemplate.penaltyOptions || [];
    this.paymentTypeData = this.dynamicDepositProductsTemplate.paymentTypeOptions || [];
    const accountingMappingOptions = this.dynamicDepositProductsTemplate.accountingMappingOptions || {};
    this.assetAccountData = accountingMappingOptions.assetAccountOptions || [];
    this.incomeAccountData = accountingMappingOptions.incomeAccountOptions || [];
    this.expenseAccountData = accountingMappingOptions.expenseAccountOptions || [];
    this.liabilityAccountData = accountingMappingOptions.liabilityAccountOptions || [];
    if (!(this.dynamicDepositProductsTemplate === undefined) && this.dynamicDepositProductsTemplate.id) {
      this.assignAccountingStepData();
    }
  }

  assignAccountingStepData() {
    const accountingMappings = this.dynamicDepositProductsTemplate.accountingMappings || {};
    this.dynamicDepositProductAccountingForm.patchValue({
      accountingRule: this.dynamicDepositProductsTemplate.accountingRule?.id || 1
    });
    if (!this.isCashOrAccrualAccounting()) {
      return;
    }
    if (this.isCashOrAccrualAccounting()) {
      this.dynamicDepositProductAccountingForm.patchValue({
        savingsReferenceAccountId: accountingMappings.savingsReferenceAccount?.id || '',
        savingsControlAccountId: accountingMappings.savingsControlAccount?.id || '',
        transfersInSuspenseAccountId: accountingMappings.transfersInSuspenseAccount?.id || '',
        incomeFromFeeAccountId: accountingMappings.incomeFromFeeAccount?.id || '',
        incomeFromPenaltyAccountId: accountingMappings.incomeFromPenaltyAccount?.id || '',
        interestOnSavingsAccountId: accountingMappings.interestOnSavingsAccount?.id || ''
      });

      if (this.isAccrualAccounting()) {
        this.dynamicDepositProductAccountingForm.patchValue({
          feesReceivableAccountId: accountingMappings.feeReceivableAccount?.id || '',
          penaltiesReceivableAccountId: accountingMappings.penaltyReceivableAccount?.id || '',
          interestPayableAccountId: accountingMappings.interestPayableAccount?.id || ''
        });
      }

      if (
        this.hasItems(this.dynamicDepositProductsTemplate.paymentChannelToFundSourceMappings) ||
        this.hasItems(this.dynamicDepositProductsTemplate.feeToIncomeAccountMappings) ||
        this.hasItems(this.dynamicDepositProductsTemplate.penaltyToIncomeAccountMappings)
      ) {
        this.dynamicDepositProductAccountingForm.patchValue({
          advancedAccountingRules: true
        });
      }
      if (this.dynamicDepositProductsTemplate.paymentChannelToFundSourceMappings) {
        this.dynamicDepositProductsTemplate.paymentChannelToFundSourceMappings.forEach(
          (paymentChannelToFundSourceMapping: any) => {
            const paymentChannelToFundSourceMappingData = this.formBuilder.group({
              paymentTypeId: [
                paymentChannelToFundSourceMapping.paymentType.id,
                Validators.required
              ],
              fundSourceAccountId: [
                paymentChannelToFundSourceMapping.fundSourceAccount.id,
                Validators.required
              ]
            });
            const formArray = this.dynamicDepositProductAccountingForm.controls[
              'paymentChannelToFundSourceMappings'
            ] as UntypedFormArray;
            formArray.push(paymentChannelToFundSourceMappingData);
          }
        );
      }
      if (this.dynamicDepositProductsTemplate.feeToIncomeAccountMappings) {
        this.dynamicDepositProductsTemplate.feeToIncomeAccountMappings.forEach((feeToIncomeAccountMapping: any) => {
          const feeToIncomeAccountMappingData = this.formBuilder.group({
            chargeId: [
              feeToIncomeAccountMapping.charge.id,
              Validators.required
            ],
            incomeAccountId: [
              feeToIncomeAccountMapping.incomeAccount.id,
              Validators.required
            ]
          });
          const formArray = this.dynamicDepositProductAccountingForm.controls[
            'feeToIncomeAccountMappings'
          ] as UntypedFormArray;
          formArray.push(feeToIncomeAccountMappingData);
        });
      }
      if (this.dynamicDepositProductsTemplate.penaltyToIncomeAccountMappings) {
        this.dynamicDepositProductsTemplate.penaltyToIncomeAccountMappings.forEach(
          (penaltyToIncomeAccountMapping: any) => {
            const penaltyToIncomeAccountMappingData = this.formBuilder.group({
              chargeId: [
                penaltyToIncomeAccountMapping.charge.id,
                Validators.required
              ],
              incomeAccountId: [
                penaltyToIncomeAccountMapping.incomeAccount.id,
                Validators.required
              ]
            });
            const formArray = this.dynamicDepositProductAccountingForm.controls[
              'penaltyToIncomeAccountMappings'
            ] as UntypedFormArray;
            formArray.push(penaltyToIncomeAccountMappingData);
          }
        );
      }
    }
  }

  createdynamicDepositProductAccountingForm() {
    this.dynamicDepositProductAccountingForm = this.formBuilder.group({
      accountingRule: [1],
      advancedAccountingRules: [false]
    });
  }

  existCharges(): boolean {
    return this.chargeData.length > 0;
  }

  existPenalties(): boolean {
    return this.penaltyData.length > 0;
  }

  setConditionalControls() {
    this.dynamicDepositProductAccountingForm.get('accountingRule').valueChanges.subscribe((accountingRule: any) => {
      this.configureAccountingControls(accountingRule);
    });
    this.dynamicDepositProductAccountingForm
      .get('advancedAccountingRules')
      .valueChanges.subscribe((advancedAccountingRules: boolean) => {
        this.configureAdvancedAccountingControls(advancedAccountingRules);
      });
    this.configureAccountingControls(this.dynamicDepositProductAccountingForm.get('accountingRule').value);
  }

  private configureAccountingControls(accountingRule: number): void {
    if (!this.accounting.isCashOrAccrualAccountingRuleId(accountingRule)) {
      this.setAdvancedAccountingRules(false);
      this.removeControls([
        ...this.baseAccountingControlNames,
        ...this.accrualAccountingControlNames
      ]);
      return;
    }

    this.baseAccountingControlNames.forEach((controlName: string) => this.addRequiredControl(controlName));

    if (this.accounting.isAccrualAccountingRuleId(accountingRule)) {
      this.accrualAccountingControlNames.forEach((controlName: string) => this.addRequiredControl(controlName));
    } else {
      this.removeControls(this.accrualAccountingControlNames);
    }

    this.configureAdvancedAccountingControls(
      this.dynamicDepositProductAccountingForm.get('advancedAccountingRules').value
    );
  }

  private configureAdvancedAccountingControls(advancedAccountingRules: boolean): void {
    if (advancedAccountingRules && this.isCashOrAccrualAccounting()) {
      this.addFormArrayControl('paymentChannelToFundSourceMappings');
      this.addFormArrayControl('feeToIncomeAccountMappings');
      this.addFormArrayControl('penaltyToIncomeAccountMappings');
    } else {
      this.removeControls(this.advancedAccountingControlNames);
    }
  }

  private setAdvancedAccountingRules(advancedAccountingRules: boolean): void {
    this.dynamicDepositProductAccountingForm.get('advancedAccountingRules').setValue(advancedAccountingRules, {
      emitEvent: false
    });
    this.configureAdvancedAccountingControls(advancedAccountingRules);
  }

  private addRequiredControl(controlName: string): void {
    if (!this.dynamicDepositProductAccountingForm.contains(controlName)) {
      this.dynamicDepositProductAccountingForm.addControl(controlName, new UntypedFormControl('', Validators.required));
    }
  }

  private addFormArrayControl(controlName: string): void {
    if (!this.dynamicDepositProductAccountingForm.contains(controlName)) {
      this.dynamicDepositProductAccountingForm.addControl(controlName, this.formBuilder.array([]));
    }
  }

  private removeControls(controlNames: string[]): void {
    controlNames.forEach((controlName: string) => {
      if (this.dynamicDepositProductAccountingForm.contains(controlName)) {
        this.dynamicDepositProductAccountingForm.removeControl(controlName);
      }
    });
  }

  private hasItems(data: any): boolean {
    return Array.isArray(data) && data.length > 0;
  }

  get paymentChannelToFundSourceMappings(): UntypedFormArray {
    return this.dynamicDepositProductAccountingForm.get('paymentChannelToFundSourceMappings') as UntypedFormArray;
  }

  get feeToIncomeAccountMappings(): UntypedFormArray {
    return this.dynamicDepositProductAccountingForm.get('feeToIncomeAccountMappings') as UntypedFormArray;
  }

  get penaltyToIncomeAccountMappings(): UntypedFormArray {
    return this.dynamicDepositProductAccountingForm.get('penaltyToIncomeAccountMappings') as UntypedFormArray;
  }

  setDynamicDepositProductAccountingFormDirty() {
    if (this.dynamicDepositProductAccountingForm.pristine) {
      this.dynamicDepositProductAccountingForm.markAsDirty();
    }
  }

  add(formType: string, formArray: UntypedFormArray) {
    const data = { ...this.getData(formType), pristine: false };
    const dialogRef = this.dialog.open(FormDialogComponent, { data, width: '20rem' });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        formArray.push(response.data);
        this.setDynamicDepositProductAccountingFormDirty();
      }
    });
  }

  edit(formType: string, formArray: UntypedFormArray, index: number) {
    const data = { ...this.getData(formType, formArray.at(index).value), layout: { addButtonText: 'Edit' } };
    const dialogRef = this.dialog.open(FormDialogComponent, { data });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response.data) {
        formArray.at(index).patchValue(response.data.value);
        this.setDynamicDepositProductAccountingFormDirty();
      }
    });
  }

  delete(formArray: UntypedFormArray, index: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: this.translateService.instant('labels.text.this') }
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        formArray.removeAt(index);
        this.setDynamicDepositProductAccountingFormDirty();
      }
    });
  }

  getData(formType: string, values?: any) {
    switch (formType) {
      case 'PaymentFundSource':
        return {
          title: 'Configure Fund Sources for Payment Channels',
          formfields: this.getPaymentFundSourceFormfields(values)
        };
      case 'FeesIncome':
        return { title: 'Map Fees to Income Accounts', formfields: this.getFeesIncomeFormfields(values) };
      case 'PenaltyIncome':
        return {
          title: 'Map Penalties to Specific Income Accounts',
          formfields: this.getPenaltyIncomeFormfields(values)
        };
    }
  }

  getPaymentFundSourceFormfields(values?: any) {
    const formfields: FormfieldBase[] = [
      new SelectBase({
        controlName: 'paymentTypeId',
        label: 'Payment Type',
        value: values ? values.paymentTypeId : this.paymentTypeData[0].id,
        options: { label: 'name', value: 'id', data: this.paymentTypeData },
        required: true,
        order: 1
      }),
      new SelectBase({
        controlName: 'fundSourceAccountId',
        label: 'Fund Source',
        value: values ? values.fundSourceAccountId : this.assetAccountData[0].id,
        options: { label: 'name', value: 'id', data: this.assetAccountData },
        required: true,
        order: 2
      })
    ];
    return formfields;
  }

  getFeesIncomeFormfields(values?: any) {
    const formfields: FormfieldBase[] = [
      new SelectBase({
        controlName: 'chargeId',
        label: 'Fees',
        value: values ? values.chargeId : this.chargeData[0].id,
        options: { label: 'name', value: 'id', data: this.chargeData },
        required: true,
        order: 1
      }),
      new SelectBase({
        controlName: 'incomeAccountId',
        label: 'Income Account',
        value: values ? values.incomeAccountId : this.incomeAccountData[0].id,
        options: { label: 'name', value: 'id', data: this.incomeAccountData },
        required: true,
        order: 2
      })
    ];
    return formfields;
  }

  getPenaltyIncomeFormfields(values?: any) {
    const formfields: FormfieldBase[] = [
      new SelectBase({
        controlName: 'chargeId',
        label: 'Penalty',
        value: values ? values.chargeId : this.penaltyData[0].id,
        options: { label: 'name', value: 'id', data: this.penaltyData },
        required: true,
        order: 1
      }),
      new SelectBase({
        controlName: 'incomeAccountId',
        label: 'Income Account',
        value: values ? values.incomeAccountId : this.incomeAccountData[0].id,
        options: { label: 'name', value: 'id', data: this.incomeAccountData },
        required: true,
        order: 2
      })
    ];
    return formfields;
  }

  get dynamicDepositProductAccounting() {
    return this.dynamicDepositProductAccountingForm.value;
  }

  isCashOrAccrualAccounting(): boolean {
    return this.accounting.isCashOrAccrualAccountingRuleId(
      this.dynamicDepositProductAccountingForm.value.accountingRule
    );
  }

  isAccrualAccounting(): boolean {
    return this.accounting.isAccrualAccountingRuleId(this.dynamicDepositProductAccountingForm.value.accountingRule);
  }
}
