import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorScheduleManagementComponent } from './professor-schedule-management.component';

describe('ProfessorScheduleManagementComponent', () => {
  let component: ProfessorScheduleManagementComponent;
  let fixture: ComponentFixture<ProfessorScheduleManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorScheduleManagementComponent]
    });
    fixture = TestBed.createComponent(ProfessorScheduleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
