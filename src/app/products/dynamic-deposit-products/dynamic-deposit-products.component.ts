/** Angular Imports */
import { Component, OnInit, TemplateRef, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatTableDataSource,
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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

/** rxjs Imports */
import { of } from 'rxjs';

/* Custom Services */
import { PopoverService } from '../../configuration-wizard/popover/popover.service';
import { ConfigurationWizardService } from '../../configuration-wizard/configuration-wizard.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Dynamic Deposit Products component.
 */
@Component({
  selector: 'mifosx-dynamic-deposit-products',
  templateUrl: './dynamic-deposit-products.component.html',
  styleUrls: ['./dynamic-deposit-products.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    FaIconComponent,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatPaginator
  ]
})
export class DynamicDepositProductsComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private configurationWizardService = inject(ConfigurationWizardService);
  private popoverService = inject(PopoverService);

  /** Fixed deposit products data. */
  dynamicDepositProductData: any;
  /** Columns to be displayed in dynamic deposit products table. */
  displayedColumns: string[] = [
    'name',
    'shortName'
  ];
  /** Data source for dynamic deposit products table. */
  dataSource: MatTableDataSource<any>;

  /** Paginator for dynamic deposit products table. */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  /** Sorter for dynamic deposit products table. */
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /* Reference of create fixed product button */
  @ViewChild('buttonCreateFixedProduct') buttonCreateFixedProduct: ElementRef<any>;
  /* Template for popover on create fixed product button */
  @ViewChild('templateButtonCreateFixedProduct') templateButtonCreateFixedProduct: TemplateRef<any>;
  /* Reference of dynamic deposit products table */
  @ViewChild('fixedProductsTable') fixedProductsTable: ElementRef<any>;
  /* Template for popover on dynamic deposit products table */
  @ViewChild('templateFixedProductsTable') templateFixedProductsTable: TemplateRef<any>;

  /**
   * Retrieves the dynamic deposit products data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router.
   * @param {ConfigurationWizardService} configurationWizardService ConfigurationWizard Service.
   * @param {PopoverService} popoverService PopoverService.
   */
  constructor() {
    this.route.data.subscribe((data: { dynamicDepositProducts: any }) => {
      this.dynamicDepositProductData = data.dynamicDepositProducts;
    });
  }

  /**
   * Filters data in dynamic deposit products table based on passed value.
   * @param {string} filterValue Value to filter data.
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Sets the dynamic deposit products table.
   */
  ngOnInit() {
    this.setDynamicDepositProducts();
  }

  /**
   * Initializes the data source, paginator and sorter for dynamic deposit products table.
   */
  setDynamicDepositProducts() {
    this.dataSource = new MatTableDataSource(this.dynamicDepositProductData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * To show popover.
   */
  ngAfterViewInit() {
    if (this.configurationWizardService.showDynamicDepositProductsPage === true) {
      setTimeout(() => {
        this.showPopover(
          this.templateButtonCreateFixedProduct,
          this.buttonCreateFixedProduct.nativeElement,
          'bottom',
          true
        );
      });
    }

    if (this.configurationWizardService.showDynamicDepositProductsList === true) {
      setTimeout(() => {
        this.showPopover(this.templateFixedProductsTable, this.fixedProductsTable.nativeElement, 'top', true);
      });
    }
  }

  /**
   * Popover function
   * @param template TemplateRef<any>.
   * @param target HTMLElement | ElementRef<any>.
   * @param position String.
   * @param backdrop Boolean.
   */
  showPopover(
    template: TemplateRef<any>,
    target: HTMLElement | ElementRef<any>,
    position: string,
    backdrop: boolean
  ): void {
    setTimeout(() => this.popoverService.open(template, target, position, backdrop, {}), 200);
  }

  /**
   * Next Step (Recurring Deposits Products-Products Page) Configuration Wizard.
   */
  nextStep() {
    this.configurationWizardService.showDynamicDepositProductsPage = false;
    this.configurationWizardService.showDynamicDepositProductsList = false;
    this.configurationWizardService.showRecurringDepositProducts = true;
    this.router.navigate(['/products']);
  }

  /**
   * Previous Step (Dynamic Deposits Products-Products Page) Configuration Wizard.
   */
  previousStep() {
    this.configurationWizardService.showDynamicDepositProductsPage = false;
    this.configurationWizardService.showDynamicDepositProductsList = false;
    this.configurationWizardService.showDynamicDepositProducts = true;
    this.router.navigate(['/products']);
  }
}
