import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGroupFormModalComponent } from './student-group-form-modal.component';

describe('StudentGroupFormModalComponent', () => {
  let component: StudentGroupFormModalComponent;
  let fixture: ComponentFixture<StudentGroupFormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentGroupFormModalComponent]
    });
    fixture = TestBed.createComponent(StudentGroupFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
