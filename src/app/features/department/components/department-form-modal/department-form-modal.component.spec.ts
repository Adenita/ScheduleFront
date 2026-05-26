import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentFormModalComponent } from './department-form-modal.component';

describe('DepartmentFormModalComponent', () => {
  let component: DepartmentFormModalComponent;
  let fixture: ComponentFixture<DepartmentFormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentFormModalComponent]
    });
    fixture = TestBed.createComponent(DepartmentFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
