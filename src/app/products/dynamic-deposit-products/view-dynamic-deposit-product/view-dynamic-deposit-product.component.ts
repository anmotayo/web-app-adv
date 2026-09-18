/** Angular Imports */
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Dynamic Deposit Product component.
 */
@Component({
  selector: 'mifosx-view-dynamic-deposit-product',
  templateUrl: './view-dynamic-deposit-product.component.html',
  styleUrls: ['./view-dynamic-deposit-product.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatTabNav,
    MatTabLink,
    RouterLinkActive,
    MatTabNavPanel,
    RouterOutlet
  ]
})
export class ViewDynamicDepositProductComponent {
  private route = inject(ActivatedRoute);

  dynamicDepositDatatables: any = [];

  constructor() {
    this.route.data.subscribe((data: { dynamicDepositDatatables: any }) => {
      this.dynamicDepositDatatables = [];
      data.dynamicDepositDatatables.forEach((datatable: any) => {
        if (datatable.entitySubType === 'Dynamic Deposit') {
          this.dynamicDepositDatatables.push(datatable);
        }
      });
    });
  }
}
