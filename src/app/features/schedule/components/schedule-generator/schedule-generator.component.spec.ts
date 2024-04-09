import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleGeneratorComponent } from './schedule-generator.component';

describe('ScheduleGeneratorComponent', () => {
  let component: ScheduleGeneratorComponent;
  let fixture: ComponentFixture<ScheduleGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleGeneratorComponent]
    });
    fixture = TestBed.createComponent(ScheduleGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
