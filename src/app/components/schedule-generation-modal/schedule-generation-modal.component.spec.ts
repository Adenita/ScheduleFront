import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleGenerationModalComponent } from './schedule-generation-modal.component';

describe('GenerateScheduleModalComponent', () => {
  let component: ScheduleGenerationModalComponent;
  let fixture: ComponentFixture<ScheduleGenerationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleGenerationModalComponent],
    });
    fixture = TestBed.createComponent(ScheduleGenerationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
