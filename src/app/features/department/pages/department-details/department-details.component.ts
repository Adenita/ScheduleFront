import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../../../core/services/http/department.service';
import { DepartmentDetailTransport } from '../../../../shared/models/department';
import { RouteParametersService } from '../../../../core/services/route-parameters.service';
import { PermissionService } from '../../../../auth/services/permission.service';
import { Role } from '../../../../shared/models/user';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.scss'],
})
export class DepartmentDetailsComponent implements OnInit, OnDestroy {
  departmentId: number = -1;
  department$: BehaviorSubject<DepartmentDetailTransport>;
  isAdmin: boolean = false;
  hasPermission: boolean = false;
  destroyed$: Subject<void> = new Subject();
  isSchedule: boolean = false;

  constructor(
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private routeParametersService: RouteParametersService,
    private departmentService: DepartmentService,
    private permissionService: PermissionService,
  ) {
    this.department$ = new BehaviorSubject<DepartmentDetailTransport>({} as DepartmentDetailTransport);
  }

  ngOnInit(): void {
    this.routeParametersService
      .getCurrentRoute(this.activatedRoute)
      .then(() => {
        this.departmentId = this.routeParametersService.departmentId;
        if (this.routeParametersService.currentRoute.includes('schedules')) {
          this.isSchedule = true;
        }
      })
      .then(() => this.getDepartment(this.departmentId));

    this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
    this.hasPermission = this.permissionService.hasAnyRole([Role.ADMIN, Role.PROFESSOR]);
  }

  getDepartment(departmentId: number) {
    this.departmentService
      .getDepartmentDetails(departmentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (department) => {
          this.department$.next(department);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
