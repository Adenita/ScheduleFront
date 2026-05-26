import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomFormModalComponent } from './classroom-form-modal.component';

describe('ClassroomFormModalComponent', () => {
  let component: ClassroomFormModalComponent;
  let fixture: ComponentFixture<ClassroomFormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassroomFormModalComponent]
    });
    fixture = TestBed.createComponent(ClassroomFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
