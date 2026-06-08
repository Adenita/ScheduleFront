import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Role, UserListTransport } from '../../../../../../shared/models/user';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserModalData, UserModalManagementService } from '../../services/user-modal-management.service';
import { ActivatedRoute } from '@angular/router';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { DepartmentService } from '../../../../../../core/services/http/department.service';
import { UserService } from '../../../../../../core/services/http/user.service';
import { UserFormModalComponent } from '../../components/user-form-modal/user-form-modal.component';
import { UserTransport } from '../../../../../../shared/models/user';
import { AuthenticationService } from '../../../../../../core/services/http/authentication.service';
import { RegisterTransport } from '../../../../../../shared/models/authentication';
import { DepartmentTransport } from '../../../../../../shared/models/department';

@Component({
    selector: 'app-user-management',
    standalone: false,
    templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit, OnDestroy {
    departmentId: number = -1;
    users$: BehaviorSubject<UserTransport[]>;
    route: string = '';
    userForm: FormGroup;
    isEditMode: boolean = false;
    userToBeEdited: number = -1;
    destroyed$: Subject<void> = new Subject<void>();
    userModalData: UserModalData = {} as UserModalData;
    roles: Role[] = Object.values(Role);

    constructor(
        private activatedRoute: ActivatedRoute,
        private routeParametersService: RouteParametersService,
        private departmentService: DepartmentService,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private userModalManagementService: UserModalManagementService,
    ) {
        this.userForm = this.buildUserFormGroup(formBuilder);
        this.users$ = new BehaviorSubject<UserTransport[]>([]);
    }

    ngOnInit() {
        this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
            this.departmentId = this.routeParametersService.departmentId;
            this.route = this.routeParametersService.setRoute('users');
            this.bindUserModalData();
            this.getDepartmentUsers();
        });
    }

    buildUserFormGroup(formBuilder: FormBuilder): FormGroup {
        return formBuilder.group({
            name: new FormControl('', Validators.required),
            role: new FormControl(this.roles[0], Validators.required),
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }

    getDepartmentUsers() {
        this.departmentService.getDepartmentUsers(this.departmentId).subscribe({
            next: (userTransportList: UserListTransport) => {
                this.users$.next(userTransportList.userTransports);
            },
            error: (err) => console.error('Error fetching department users', err),
        });
    }

    addUser() {
        if (this.userForm.valid) {
            const user = this.userForm.value as RegisterTransport;
            user.department = { id: 1, name: 'Matematike' } as DepartmentTransport;
            this.authService.register(user).subscribe({
                next: (userTransport: RegisterTransport) => {
                    // const us = userTransport as UserTransport
                    // this.users$.next([...this.users$.getValue(), userTransport]);
                },
                error: (err) => console.error('Error adding user:', err),
            });
        }
    }

    deleteUser(userId: number) {
        this.userService
            .delete(userId)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: () => {
                    const currentUsers: UserTransport[] = this.users$.getValue();
                    const updatedUsers: UserTransport[] = currentUsers.filter((user) => user.id !== userId);
                    this.users$.next(updatedUsers);
                },
                error: (err) => console.error('Error deleting user:', err),
            });
    }

    updateUser(userId: number) {
        if (this.userForm.valid) {
            this.userService
                .update(userId, this.userForm.value)
                .pipe(takeUntil(this.destroyed$))
                .subscribe({
                    next: (updatedUser: UserTransport) => {
                        const currentUsers: UserTransport[] = this.users$.getValue();
                        const updatedUsers: UserTransport[] = currentUsers.map((user) => {
                            if (user.id === userId) {
                                return updatedUser;
                            }
                            return user;
                        });
                        this.users$.next(updatedUsers);
                    },
                    error: (err) => console.error('Error updating user:', err),
                });
        }
    }

    openUserFormModalInEditMode(id: number) {
        this.userModalManagementService.update = this.updateUser.bind(this);
        this.userModalManagementService.openFormModalInEditMode(UserFormModalComponent, id, this.userModalData);
    }

    openUserFormModal() {
        this.userModalManagementService.post = this.addUser.bind(this);
        this.userModalManagementService.openFormModal(UserFormModalComponent, this.userModalData);
    }

    bindUserModalData() {
        this.userModalData = this.userModalManagementService.bindUserModalData(
            this.userToBeEdited,
            this.userForm,
            this.isEditMode,
            this.users$,
            this.roles,
        );
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
