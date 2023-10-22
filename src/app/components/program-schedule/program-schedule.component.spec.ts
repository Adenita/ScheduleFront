import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramScheduleComponent } from './program-schedule.component';

describe('ScheduleProgramComponent', () => {
  let component: ProgramScheduleComponent;
  let fixture: ComponentFixture<ProgramScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramScheduleComponent],
    });
    fixture = TestBed.createComponent(ProgramScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
