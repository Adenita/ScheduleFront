import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DepartmentService } from '../../../../core/services/http/department.service';
import { DepartmentDetailTransport } from '../../../../shared/models/department';
import { RouteParametersService } from '../../../../core/services/route-parameters.service';
import { PermissionService } from '../../../../auth/services/permission.service';
import { Role } from '../../../../shared/models/user';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.scss'],
})
export class DepartmentDetailsComponent implements OnInit {
  departmentId: number = -1;
  department: DepartmentDetailTransport = {} as DepartmentDetailTransport;
  currentRoute: string = '';
  isAdmin: boolean = false;
  hasPermission: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private departmentService: DepartmentService,
    private permissionService: PermissionService,
  ) {}

  ngOnInit(): void {
    this.routeParametersService
      .getRouteParams(this.route)
      .then(() => {
        this.departmentId = this.routeParametersService.departmentId;
        this.currentRoute = this.routeParametersService.setRoute('');
      })
      .then(() => this.getDepartment(this.departmentId));

    this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
    this.hasPermission = this.permissionService.hasAnyRole([Role.ADMIN, Role.PROFESSOR]);
  }

  getDepartment(departmentId: number) {
    this.departmentService.getDepartmentDetails(departmentId).subscribe({
      next: (department) => {
        this.department = department;
      },
    });
  }
}
