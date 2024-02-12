import { Component, OnInit } from '@angular/core';
import { AuthenticationManagerService } from './core/services/authentication-manager.service';
import { LoginFormModalComponent } from './auth/components/login-form-modal/login-form-modal.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginModalData, LoginModalManagementService } from './auth/services/login-modal-management.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  username: string | null = '';
  loginForm: FormGroup;
  loginModalData: LoginModalData = {} as LoginModalData;

  constructor(
    private authenticationManagerService: AuthenticationManagerService,
    private formBuilder: FormBuilder,
    private loginModalManagementService: LoginModalManagementService,
  ) {
    this.loginForm = this.buildLoginFormGroup(formBuilder);
  }

  ngOnInit(): void {
    this.bindLoginModalData();
    const user = this.authenticationManagerService.getUser();
    if (user) {
      this.username = user.username;
    }
    this.isLoggedIn = !!this.username;
  }

  buildLoginFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }

  login() {
    this.authenticationManagerService.login(this.loginForm);
  }

  logout() {
    this.authenticationManagerService.logout();
  }

  openLoginModalData() {
    this.loginModalManagementService.post = this.login.bind(this);
    this.loginModalManagementService.openFormModal(LoginFormModalComponent, this.loginModalData);
  }

  bindLoginModalData() {
    this.loginModalData = this.loginModalManagementService.bindLoginModalData(this.loginForm);
  }
}
