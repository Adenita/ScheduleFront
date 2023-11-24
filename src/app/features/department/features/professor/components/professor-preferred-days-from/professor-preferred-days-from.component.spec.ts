import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorPreferredDaysFromComponent } from './professor-preferred-days-from.component';

describe('ProfessorPreferredDaysFromComponent', () => {
  let component: ProfessorPreferredDaysFromComponent;
  let fixture: ComponentFixture<ProfessorPreferredDaysFromComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorPreferredDaysFromComponent]
    });
    fixture = TestBed.createComponent(ProfessorPreferredDaysFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
