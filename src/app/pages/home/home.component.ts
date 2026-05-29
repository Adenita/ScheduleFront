import { Component, OnInit } from '@angular/core';
import { LoginFormModalComponent } from '../../auth/components/login-form-modal/login-form-modal.component';
import { LoginModalData, LoginModalManagementService } from '../../auth/services/login-modal-management.service';
import { AuthenticationManagerService } from '../../core/services/authentication-manager.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  loginModalData: LoginModalData = {} as LoginModalData;

  constructor(
    formBuilder: FormBuilder,
    private authenticationManagerService: AuthenticationManagerService,
    private loginModalManagementService: LoginModalManagementService,
  ) {
    this.loginForm = formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
  }

  ngOnInit() {
    this.loginModalData = this.loginModalManagementService.bindLoginModalData(this.loginForm);
  }

  login() {
    this.authenticationManagerService.login(this.loginForm);
  }

  openLogin() {
    this.loginModalManagementService.post = this.login.bind(this);
    this.loginModalManagementService.openFormModal(LoginFormModalComponent, this.loginModalData);
  }
}
