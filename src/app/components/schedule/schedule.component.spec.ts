import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Schedule } from './schedule.component';

describe('ScheduleEventsComponent', () => {
  let component: Schedule;
  let fixture: ComponentFixture<Schedule>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Schedule],
    });
    fixture = TestBed.createComponent(Schedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
