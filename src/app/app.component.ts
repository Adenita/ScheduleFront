import { Component, OnInit } from '@angular/core';
import { AuthenticationManagerService } from './core/services/authentication-manager.service';
import { LoginFormModalComponent } from './auth/components/login-form-modal/login-form-modal.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginModalData, LoginModalManagementService } from './auth/services/login-modal-management.service';
import { StorageService } from './core/services/storage.service';
import { PermissionService } from './auth/services/permission.service';
import { Role, UserTransport } from './shared/models/user';
import { UserService } from './core/services/http/user.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isAdmin: boolean = false;
  isProfessor: boolean = false;
  isStudent: boolean = false;
  isSidebarCollapsed: boolean = false;
  username: string | null = '';
  currentUser?: UserTransport;
  loginForm: FormGroup;
  loginModalData: LoginModalData = {} as LoginModalData;

  constructor(
    formBuilder: FormBuilder,
    private authenticationManagerService: AuthenticationManagerService,
    private loginModalManagementService: LoginModalManagementService,
    private storageService: StorageService,
    private permissionService: PermissionService,
    private userService: UserService,
  ) {
    this.loginForm = this.buildLoginFormGroup(formBuilder);
  }

  ngOnInit(): void {
    this.bindLoginModalData();
    this.storageService.storedUser$.subscribe({
      next: (storedUser) => {
        if (storedUser) {
          this.username = storedUser.username;
          this.loadCurrentUser(storedUser.username);
        } else {
          this.username = '';
          this.currentUser = undefined;
        }
        this.isLoggedIn = !!storedUser;
        this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
        this.isProfessor = this.permissionService.hasRole(Role.PROFESSOR);
        this.isStudent = this.permissionService.hasRole(Role.STUDENT);
      },
    });
  }

  get linkedDepartmentId(): number | undefined {
    return this.currentUser?.departmentTransport?.id;
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
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

  private loadCurrentUser(username: string) {
    this.userService.getUserByUsername(username).subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => console.error('Error fetching current user', err),
    });
  }

  openLoginModalData() {
    this.loginModalManagementService.post = this.login.bind(this);
    this.loginModalManagementService.openFormModal(LoginFormModalComponent, this.loginModalData);
  }

  bindLoginModalData() {
    this.loginModalData = this.loginModalManagementService.bindLoginModalData(this.loginForm);
  }
}
