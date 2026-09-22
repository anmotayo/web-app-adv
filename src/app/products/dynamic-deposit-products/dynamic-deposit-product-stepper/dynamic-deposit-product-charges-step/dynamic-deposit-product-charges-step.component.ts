import { Component, Input, OnInit, inject } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
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
import { ChargesFilterPipe } from '../../../../pipes/charges-filter.pipe';
import { FormatNumberPipe } from '../../../../pipes/format-number.pipe';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-dynamic-deposit-product-charges-step',
  templateUrl: './dynamic-deposit-product-charges-step.component.html',
  styleUrls: ['./dynamic-deposit-product-charges-step.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
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
    ChargesFilterPipe,
    FormatNumberPipe
  ]
})
export class DynamicDepositProductChargesStepComponent implements OnInit {
  dialog = inject(MatDialog);
  private translateService = inject(TranslateService);

  @Input() dynamicDepositProductsTemplate: any;
  @Input() currencyCode: UntypedFormControl;

  chargeData: any;

  chargesDataSource: {}[];
  pristine = true;
  displayedColumns: string[] = [
    'name',
    'chargeCalculationType',
    'amount',
    'chargeTimeType',
    'action'
  ];

  ngOnInit() {
    this.chargeData = this.dynamicDepositProductsTemplate.chargeOptions || [];
    if (!(this.dynamicDepositProductsTemplate === undefined) && this.dynamicDepositProductsTemplate.id) {
      this.chargesDataSource = this.resolveSelectedCharges(this.dynamicDepositProductsTemplate.charges || []);
    } else {
      this.chargesDataSource = [];
    }
    this.currencyCode.valueChanges.subscribe(() => {
      this.chargesDataSource = [];
      this.pristine = false;
    });
  }

  addCharge(charge: any) {
    this.chargesDataSource = this.chargesDataSource.concat([charge.value]);
    charge.value = '';
    this.pristine = false;
  }

  deleteCharge(charge: any) {
    const deleteChargeDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: this.translateService.instant('labels.inputs.Charge') + ' ' + charge.name }
    });
    deleteChargeDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.chargesDataSource.splice(this.chargesDataSource.indexOf(charge), 1);
        this.chargesDataSource = this.chargesDataSource.concat([]);
        this.pristine = false;
      }
    });
  }

  get dynamicDepositProductCharges() {
    return {
      charges: this.chargesDataSource
    };
  }

  chargeNameWithCurrency(charge: any): string {
    const resolvedCharge = this.resolveCharge(charge);
    const currency = resolvedCharge?.currency || {};
    const currencyDisplay = currency.displaySymbol || currency.code || this.currencyCode?.value;
    return [
      resolvedCharge?.name,
      currencyDisplay
    ]
      .filter(Boolean)
      .join(', ');
  }

  private resolveSelectedCharges(charges: any[]): any[] {
    return charges.map((charge: any) => this.resolveCharge(charge));
  }

  private resolveCharge(charge: any): any {
    const chargeId = this.getChargeId(charge);
    const matchingCharge = (this.chargeData || []).find(
      (chargeOption: any) => String(chargeOption.id) === String(chargeId)
    );
    return {
      ...(matchingCharge || {}),
      ...(charge || {}),
      currency: charge?.currency || matchingCharge?.currency,
      chargeCalculationType: charge?.chargeCalculationType || matchingCharge?.chargeCalculationType,
      chargeTimeType: charge?.chargeTimeType || matchingCharge?.chargeTimeType
    };
  }

  private getChargeId(charge: any): any {
    return charge?.id ?? charge?.chargeId ?? charge;
  }
}
