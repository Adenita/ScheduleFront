import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramScheduleManagementComponent } from './program-schedule-management.component';

describe('ProgramScheduleManagementComponent', () => {
  let component: ProgramScheduleManagementComponent;
  let fixture: ComponentFixture<ProgramScheduleManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramScheduleManagementComponent]
    });
    fixture = TestBed.createComponent(ProgramScheduleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
