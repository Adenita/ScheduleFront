import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorPreferredDaysFromModalComponent } from './professor-preferred-days-from-modal.component';

describe('ProfessorPreferredDaysFromModalComponent', () => {
  let component: ProfessorPreferredDaysFromModalComponent;
  let fixture: ComponentFixture<ProfessorPreferredDaysFromModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorPreferredDaysFromModalComponent]
    });
    fixture = TestBed.createComponent(ProfessorPreferredDaysFromModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
