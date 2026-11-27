import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { describe, expect, it, jest } from '@jest/globals';
import { ConfigureMakerCheckerTasksComponent } from './configure-maker-checker-tasks.component';
import { SystemService } from '../system.service';
import { ConfigurationWizardService } from '../../configuration-wizard/configuration-wizard.service';
import { PopoverService } from '../../configuration-wizard/popover/popover.service';

describe('ConfigureMakerCheckerTasksComponent', () => {
  it('submits the checked permission from a later grouping under its own code', async () => {
    const permissions = [
      { code: 'CREATE_CLIENT', id: 1, selected: false, grouping: 'portfolio' },
      { code: 'CREATE_DYNAMICDEPOSITPRODUCT', id: 2, selected: false, grouping: 'dynamicdeposit' }
    ];
    const updateMakerCheckerPermission = jest.fn(() => of({}));

    await TestBed.configureTestingModule({
      imports: [ConfigureMakerCheckerTasksComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { data: of({ permissions }) } },
        { provide: SystemService, useValue: { updateMakerCheckerPermission } },
        { provide: Router, useValue: { navigate: jest.fn() } },
        {
          provide: ConfigurationWizardService,
          useValue: { showMakerCheckerTablePage: false, showMakerCheckerTableList: false }
        },
        { provide: PopoverService, useValue: { open: jest.fn() } }
      ]
    })
      .overrideComponent(ConfigureMakerCheckerTasksComponent, {
        set: {
          imports: [ReactiveFormsModule],
          template: `
            <form [formGroup]="formGroup">
              <div formArrayName="roster">
                @for (permission of permissions.permissions; track permission.code) {
                  <div [formGroupName]="permission.formIndex">
                    <input type="checkbox" [attr.data-code]="permission.code" formControlName="selected" />
                  </div>
                }
              </div>
            </form>
          `
        }
      })
      .compileComponents();

    const fixture = TestBed.createComponent(ConfigureMakerCheckerTasksComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    component.editTask();
    component.showPermissions('dynamicdeposit');
    fixture.detectChanges();

    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[data-code="CREATE_DYNAMICDEPOSITPRODUCT"]'
    );
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    component.submit();

    expect(updateMakerCheckerPermission).toHaveBeenCalledWith({
      permissions: {
        CREATE_CLIENT: false,
        CREATE_DYNAMICDEPOSITPRODUCT: true
      }
    });
  });
});
