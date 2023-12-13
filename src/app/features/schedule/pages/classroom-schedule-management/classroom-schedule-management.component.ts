import { Component, OnDestroy, OnInit } from '@angular/core';
import { Classroom } from '../../../../shared/models/classroom';
import { ScheduleTransport } from '../../shared/models/schedule';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { RouteParametersService } from '../../../../core/services/route-parameters.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleDataService } from '../../../../core/services/http/schedule-data.service';
import { DepartmentService } from '../../../../core/services/http/department.service';
import { ClassroomService } from '../../../../core/services/http/classroom.service';

@Component({
  selector: 'app-classroom-schedule-management',
  templateUrl: './classroom-schedule-management.component.html',
  styleUrls: ['./classroom-schedule-management.component.css'],
})
export class ClassroomScheduleManagementComponent implements OnInit, OnDestroy {
  scheduleId: number = -1;
  classroomId: number = -1;
  departmentId: number = -1;

  classroomSchedule$!: BehaviorSubject<ScheduleTransport>;
  classrooms!: Classroom[];
  classroomName: string = '';

  currentRoute: string = '';
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private scheduleDataService: ScheduleDataService,
    private departmentService: DepartmentService,
    private classroomService: ClassroomService,
  ) {
    this.classroomSchedule$ = new BehaviorSubject({} as ScheduleTransport);
  }

  ngOnInit() {
    this.getRouteParameters()
      .then(() => this.getInitialClassroom(this.classroomId))
      .then(() => this.getScheduleForClassroom(this.scheduleId, this.classroomId))
      .then(() => {
        if (this.departmentId != -1) {
          this.getDepartmentClassrooms(this.departmentId);
        }
      });
  }

  getDepartmentClassrooms(departmentId: number) {
    this.departmentService
      .getDepartmentClassrooms(departmentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (classroomTransport) => {
          this.classrooms = classroomTransport.classrooms;
        },
      });
  }

  getScheduleForClassroom(scheduleId: number, classroomId: number) {
    this.scheduleDataService
      .getScheduleForClassroom(scheduleId, classroomId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (schedule) => {
          this.classroomSchedule$.next(schedule);
        },
      });
  }
  getRouteParameters() {
    return this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
      this.scheduleId = this.routeParametersService.scheduleId;
      this.classroomId = this.routeParametersService.classroomId;
      this.departmentId = this.routeParametersService.departmentId;
      this.currentRoute = this.routeParametersService.setRoute('');
    });
  }

  loadClassroomSchedule(classroom: Classroom) {
    const currentRouteWithoutLastSlash: string = this.currentRoute.substring(0, this.currentRoute.length - 1);
    const lastIndexOfSlash: number = currentRouteWithoutLastSlash.lastIndexOf('/');
    const nextRoute: string = currentRouteWithoutLastSlash.substring(0, lastIndexOfSlash);
    this.classroomName = classroom.name;
    this.router.navigate([nextRoute, classroom.id]).then(() => this.getScheduleForClassroom(this.scheduleId, classroom.id));
  }

  getInitialClassroom(professorId: number) {
    this.classroomService
      .get(professorId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (classroom: Classroom) => {
          this.classroomName = classroom.name;
        },
      });
  }

  goBack() {
    if (this.departmentId != -1) {
      this.router.navigate(['departments', this.departmentId, 'schedules']);
    } else {
      this.router.navigate(['schedules']);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
