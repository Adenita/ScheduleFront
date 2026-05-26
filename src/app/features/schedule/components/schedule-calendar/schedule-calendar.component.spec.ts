import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCalendarComponent } from './schedule-calendar.component';

describe('ScheduleCalendarComponent', () => {
  let component: ScheduleCalendarComponent;
  let fixture: ComponentFixture<ScheduleCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleCalendarComponent]
    });
    fixture = TestBed.createComponent(ScheduleCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
