import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorManagementComponent } from './professor-management.component';

describe('ProfessorsListComponent', () => {
  let component: ProfessorManagementComponent;
  let fixture: ComponentFixture<ProfessorManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorManagementComponent]
    });
    fixture = TestBed.createComponent(ProfessorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
