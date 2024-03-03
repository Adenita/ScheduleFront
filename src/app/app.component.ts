import { Component, OnInit } from '@angular/core';
import { AuthenticationManagerService } from './core/services/authentication-manager.service';
import { LoginFormModalComponent } from './auth/components/login-form-modal/login-form-modal.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginModalData, LoginModalManagementService } from './auth/services/login-modal-management.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DepartmentService } from './core/services/http/department.service';
import { DepartmentTransport } from './shared/models/department';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  username: string | null = '';
  loginForm: FormGroup;
  loginModalData: LoginModalData = {} as LoginModalData;
  selectedDepartmentId: number | null = null;

  destroyed$: Subject<void> = new Subject<void>();
  departments: BehaviorSubject<DepartmentTransport[]>;

  constructor(
    private authenticationManagerService: AuthenticationManagerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private loginModalManagementService: LoginModalManagementService,
    private departmentService: DepartmentService,
  ) {
    this.loginForm = this.buildLoginFormGroup(formBuilder);
    this.departments = new BehaviorSubject<DepartmentTransport[]>([]);
  }

  ngOnInit(): void {
    this.getDepartments();
    this.bindLoginModalData();
    const user = this.authenticationManagerService.getUser();
    if (user) {
      this.username = user.username;
    }
    this.isLoggedIn = !!this.username;
  }

  getDepartments() {
    this.departmentService
      .getAll()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (departments) => {
          this.departments.next(departments.departmentTransportList);
        },
        error: (err) => console.error('Error fetching departments', err),
      });
  }

  onScheduleChange(selectedSchedule: any) {
    if (selectedSchedule) {
      const value = selectedSchedule.target.value;
      this.selectedDepartmentId = value;
      console.log('department id: ', this.selectedDepartmentId);
      this.router.navigate([`departments/${value}/schedules`]).then(() => {
        console.log('navigated to page: ', `departments/${value}/schedules`);
        // window.location.reload();
      });
    }
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
