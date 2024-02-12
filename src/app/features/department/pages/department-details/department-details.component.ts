import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DepartmentService } from '../../../../core/services/http/department.service';
import { BehaviorSubject } from 'rxjs';
import { DepartmentDetailTransport } from '../../../../shared/models/department';
import { ProfessorTransport } from '../../../../shared/models/professor';
import { Classroom } from '../../../../shared/models/classroom';
import { ProgramDetailsTransport, ProgramTransport } from '../../../../shared/models/program';
import { RouteParametersService } from '../../../../core/services/route-parameters.service';
import { SubjectTransport } from '../../../../shared/models/subject';
import { StudentGroupTransport } from '../../../../shared/models/student-group';
import { ScheduleTransport } from '../../../schedule/shared/models/schedule';
import { ScheduleDataService } from '../../../../core/services/http/schedule-data.service';
import { PermissionService } from '../../../../auth/services/permission.service';
import { Role } from '../../../../shared/models/user';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.css'],
})
export class DepartmentDetailsComponent implements OnInit {
  departmentId: number = -1;
  numberToPreview: number = 3;
  department: DepartmentDetailTransport = {} as DepartmentDetailTransport;
  previewPrograms: BehaviorSubject<ProgramTransport[] | ProgramDetailsTransport[]>;
  previewProfessors: BehaviorSubject<ProfessorTransport[]>;
  previewClassrooms: BehaviorSubject<Classroom[]>;
  previewSubjects: BehaviorSubject<SubjectTransport[]>;
  previewStudentGroups: BehaviorSubject<StudentGroupTransport[]>;
  previewSchedules$: BehaviorSubject<ScheduleTransport[]>;
  currentRoute: string = '';
  isAdmin: boolean = false;
  hasPermission: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private departmentService: DepartmentService,
    private scheduleDataService: ScheduleDataService,
    private permissionService: PermissionService,
  ) {
    this.previewPrograms = new BehaviorSubject<ProgramTransport[] | ProgramDetailsTransport[]>([]);
    this.previewProfessors = new BehaviorSubject<ProfessorTransport[]>([]);
    this.previewClassrooms = new BehaviorSubject<Classroom[]>([]);
    this.previewSubjects = new BehaviorSubject<SubjectTransport[]>([]);
    this.previewStudentGroups = new BehaviorSubject<StudentGroupTransport[]>([]);
    this.previewSchedules$ = new BehaviorSubject<ScheduleTransport[]>([]);
  }

  ngOnInit(): void {
    this.routeParametersService
      .getRouteParams(this.route)
      .then(() => {
        this.departmentId = this.routeParametersService.departmentId;
        this.currentRoute = this.routeParametersService.setRoute('');
      })
      .then(() => this.getDepartment(this.departmentId))
      .then(() => this.getDepartmentSchedules(this.departmentId));

    this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
    this.hasPermission = this.permissionService.hasAnyRole([Role.ADMIN, Role.PROFESSOR]);
  }

  getDepartment(departmentId: number) {
    this.departmentService.getDepartmentDetails(departmentId).subscribe({
      next: (department) => {
        this.department = department;
        this.previewPrograms.next(department.programTransports.slice(0, this.numberToPreview));
        this.previewProfessors.next(department.professorTransports.slice(0, this.numberToPreview));
        this.previewClassrooms.next(department.classrooms.slice(0, this.numberToPreview));
        this.previewSubjects.next(department.subjectTransports.slice(0, this.numberToPreview));
        this.previewStudentGroups.next(department.studentGroupTransports?.slice(0, this.numberToPreview));
      },
    });
  }

  getDepartmentSchedules(departmentId: number) {
    this.scheduleDataService.getDepartmentSchedules(departmentId).subscribe({
      next: (schedules) => {
        this.previewSchedules$.next(schedules.scheduleTransports.slice(0, this.numberToPreview));
      },
    });
  }
}
