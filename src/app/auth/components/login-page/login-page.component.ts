import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationManagerService } from '../../../core/services/authentication-manager.service';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  loginError: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    formBuilder: FormBuilder,
    private authenticationManagerService: AuthenticationManagerService,
  ) {
    this.loginForm = formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    this.loginError = false;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.authenticationManagerService.login(this.loginForm).subscribe({
      next: (success) => {
        this.loginError = !success;
        this.isSubmitting = false;
      },
      error: () => {
        this.loginError = true;
        this.isSubmitting = false;
      },
    });
  }
}
