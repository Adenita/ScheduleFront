import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DepartmentTransport } from '../../shared/models/department';
import { DepartmentService } from '../../core/services/http/department.service';
import { PermissionService } from '../../auth/services/permission.service';
import { Role, UserTransport } from '../../shared/models/user';
import { StorageService } from '../../core/services/storage.service';
import { UserService } from '../../core/services/http/user.service';

@Component({
    selector: 'app-schedules-hub',
    standalone: false,
    templateUrl: './schedules-hub.component.html',
    styleUrls: ['./schedules-hub.component.scss'],
})
export class SchedulesHubComponent implements OnInit, OnDestroy {
    departments$: BehaviorSubject<DepartmentTransport[]> = new BehaviorSubject<DepartmentTransport[]>([]);
    currentUser?: UserTransport;
    isAdmin: boolean = false;
    destroyed$: Subject<void> = new Subject<void>();

    constructor(
        private departmentService: DepartmentService,
        private permissionService: PermissionService,
        private storageService: StorageService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
        this.loadCurrentUser();
        this.loadDepartments();
    }

    get visibleDepartments(): DepartmentTransport[] {
        const departments = this.departments$.getValue();
        if (this.isAdmin) {
            return departments;
        }

        const departmentId = this.currentUser?.departmentTransport?.id;
        return departments.filter((department) => department.id === departmentId);
    }

    private loadCurrentUser() {
        const storedUser = this.storageService.getUser();
        if (!storedUser?.username) {
            return;
        }

        this.userService
            .getUserByUsername(storedUser.username)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (user) => {
                    this.currentUser = user;
                },
                error: (err) => console.error('Error fetching current user', err),
            });
    }

    private loadDepartments() {
        this.departmentService
            .getAll()
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (departments) => {
                    this.departments$.next(departments.departmentTransportList);
                },
                error: (err) => console.error('Error fetching departments', err),
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
