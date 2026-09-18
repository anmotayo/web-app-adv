/** Angular Imports */
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { ActivatedRoute } from '@angular/router';

/** Custom Services */
import { DynamicDepositsService } from 'app/deposits/dynamic-deposits/dynamic-deposits.service';
import { AccountTransfersService } from 'app/account-transfers/account-transfers.service';
import { SettingsService } from 'app/settings/settings.service';

/** Dialog Components */
import { DeleteDialogComponent } from 'app/shared/delete-dialog/delete-dialog.component';
import { MatTooltip } from '@angular/material/tooltip';
import { DateFormatPipe } from '../../../../pipes/date-format.pipe';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * Dynamic Deposits Standing Instructions Tab
 */
@Component({
  selector: 'mifosx-standing-instructions-tab',
  templateUrl: './standing-instructions-tab.component.html',
  styleUrls: ['./standing-instructions-tab.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatTooltip,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    DateFormatPipe
  ]
})
export class StandingInstructionsTabComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dynamicDepositsService = inject(DynamicDepositsService);
  private dialog = inject(MatDialog);
  private accountTransfersService = inject(AccountTransfersService);
  private settingsService = inject(SettingsService);

  /** Dynamic Deposits Data */
  dynamicDepositsData: any;
  /** Instructions Data */
  instructionsData: any[];
  /** Data source for instructions table. */
  dataSource = new MatTableDataSource();
  /** Columns to be displayed in instructions table. */
  displayedColumns: string[] = [
    'client',
    'fromAccount',
    'beneficiary',
    'toAccount',
    'amount',
    'validity',
    'actions'
  ];

  /** Instruction Table Reference */
  @ViewChild('instructionsTable', { static: true }) instructionTableRef: MatTable<Element>;

  /**
   * Retrieves Dynamic Deposits Account Data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   * @param {DynamicDepositsService} dynamicDepositsService DynamicDepositsService
   * @param {MatDialog} dialog Mat Dialog
   * @param {AccountTransfersService} accountTransfersService Accounts Transfer Service
   * @param {SettingsService} settingsService Settings Service
   */
  constructor() {
    this.route.parent.data.subscribe((data: { dynamicDepositsAccountData: any }) => {
      this.dynamicDepositsData = data.dynamicDepositsAccountData;
    });
  }

  ngOnInit() {
    this.getStandingInstructions();
  }

  /**
   * Retrieves standing instructions and initializes instructions table.
   */
  getStandingInstructions() {
    const clientId = this.dynamicDepositsData.clientId;
    const clientName = this.dynamicDepositsData.clientName;
    const accountId = this.dynamicDepositsData.id;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    this.dynamicDepositsService
      .getStandingInstructions(clientId, clientName, accountId, locale, dateFormat)
      .subscribe((response: any) => {
        this.instructionsData = response.pageItems;
        this.dataSource.data = this.instructionsData;
        this.instructionTableRef.renderRows();
      });
  }

  /**
   * Deletes a standing instruction
   * @param {any} instructionId Instruction Id
   */
  deleteStandingInstruction(instructionId: any) {
    const deleteStandingInstructionDialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { deleteContext: `standing instruction id: ${instructionId}` }
    });
    deleteStandingInstructionDialogRef.afterClosed().subscribe((response: any) => {
      if (response.delete) {
        this.accountTransfersService.deleteStandingInstrucions(instructionId).subscribe(() => {});
      }
    });
  }
}
