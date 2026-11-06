import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntityDatatableTabComponent } from '../../../../shared/tabs/entity-datatable-tab/entity-datatable-tab.component';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

@Component({
  selector: 'mifosx-dynamic-deposit-datatable-tab',
  templateUrl: './dynamic-deposit-datatable-tab.component.html',
  styleUrls: ['./dynamic-deposit-datatable-tab.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    EntityDatatableTabComponent
  ]
})
export class DynamicDepositDatatableTabComponent {
  private route = inject(ActivatedRoute);

  entityId: string;
  entityDatatable: any;
  multiRowDatatableFlag: boolean;

  constructor() {
    this.entityId = this.route.parent.parent.snapshot.paramMap.get('productId');

    this.route.data.subscribe((data: { dynamicDepositDatatable: any }) => {
      this.entityDatatable = data.dynamicDepositDatatable;
      this.multiRowDatatableFlag = this.entityDatatable.columnHeaders[0].columnName === 'id' ? true : false;
    });
  }
}
