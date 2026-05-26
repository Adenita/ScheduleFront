import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormModalComponent } from './login-form-modal.component';

describe('LoginComponent', () => {
  let component: LoginFormModalComponent;
  let fixture: ComponentFixture<LoginFormModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginFormModalComponent],
    });
    fixture = TestBed.createComponent(LoginFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
