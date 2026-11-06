/**
 * Dynamic Deposits Account Buttons Configuration.
 *
 * A Dynamic Deposit has no `Matured` status: it stays `Active` until it is closed. Whether it can be closed
 * prematurely or on maturity therefore depends on its maturity date, which the caller passes as `isMatured`.
 */
export class DynamicDepositsButtonsConfiguration {
  optionArray: {
    name: string;
  }[];

  buttonsArray: {
    name: string;
    icon: string;
  }[];

  constructor(status: string, isMatured = false) {
    this.setOptions(status);
    this.setButtons(status, isMatured);
  }

  get singleButtons() {
    return this.buttonsArray;
  }

  get options() {
    return this.optionArray;
  }

  setButtons(status: string, isMatured = false) {
    switch (status) {
      case 'Active':
        this.buttonsArray = [
          {
            name: 'Deposit',
            icon: 'fa fa-arrow-up'
          },
          {
            name: 'Withdrawal',
            icon: 'fa fa-arrow-down'
          },
          // The backend only accepts a premature close before the maturity date and a close on or after it.
          isMatured
            ? {
                name: 'Close',
                icon: 'fa fa-arrow-right'
              }
            : {
                name: 'Premature Close',
                icon: 'fa fa-arrow-left'
              },
          {
            name: 'Calculate Interest',
            icon: 'fa fa-table'
          },
          {
            name: 'Undo Activation',
            icon: 'fa fa-undo'
          }
        ];
        break;
      case 'Matured':
        this.buttonsArray = [
          {
            name: 'Close',
            icon: 'fa fa-arrow-right'
          },
          {
            name: 'Calculate Interest',
            icon: 'fa fa-table'
          }
        ];
        break;
      case 'Submitted and pending approval':
        this.buttonsArray = [
          {
            name: 'Modify Application',
            icon: 'fa fa-pencil '
          },
          {
            name: 'Approve',
            icon: 'fa fa-check'
          }
        ];
        break;
      case 'Approved':
        this.buttonsArray = [
          {
            name: 'Undo Approval',
            icon: 'fa fa-undo'
          },
          {
            name: 'Activate',
            icon: 'fa fa-check'
          }
        ];
        break;
      default:
        this.buttonsArray = [];
    }
  }

  setOptions(status: string) {
    switch (status) {
      case 'Active':
      case 'Matured':
        this.optionArray = [
          {
            name: 'Post Interest'
          },
          {
            name: 'Add Charge'
          }
        ];
        break;
      case 'Submitted and pending approval':
        this.optionArray = [
          {
            name: 'Reject'
          },
          {
            name: 'Withdrawn by Client'
          },
          {
            name: 'Add Charge'
          },
          {
            name: 'Delete'
          }
        ];
        break;
      case 'Approved':
      default:
        this.optionArray = [];
    }
  }

  addOption(option: { name: string }) {
    this.optionArray.push(option);
  }

  removeButton(name: string) {
    this.buttonsArray = this.buttonsArray.filter((button) => button.name !== name);
  }
}
