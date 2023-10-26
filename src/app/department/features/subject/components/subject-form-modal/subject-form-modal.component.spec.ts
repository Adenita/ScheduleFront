import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectFormModalComponent } from './subject-form-modal.component';

describe('SubjectFormModalComponent', () => {
  let component: SubjectFormModalComponent;
  let fixture: ComponentFixture<SubjectFormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectFormModalComponent]
    });
    fixture = TestBed.createComponent(SubjectFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
