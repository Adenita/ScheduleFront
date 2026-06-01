import { Component, OnDestroy, OnInit } from '@angular/core';
import { Classroom } from '../../../../shared/models/classroom';
import { ScheduleTransport } from '../../shared/models/schedule';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleDataService } from '../../../../core/services/http/schedule-data.service';
import { DepartmentService } from '../../../../core/services/http/department.service';
import { ClassroomService } from '../../../../core/services/http/classroom.service';
import { ScheduleRouteService } from '../../services/schedule-route.service';

@Component({
  selector: 'app-classroom-schedule-management',
  standalone: false,
  templateUrl: './classroom-schedule-management.component.html',
  styleUrls: ['./classroom-schedule-management.component.scss'],
})
export class ClassroomScheduleManagementComponent implements OnInit, OnDestroy {
  scheduleId: number = -1;
  classroomId: number = -1;
  departmentId: number = -1;
  loadedClassroomsDepartmentId: number = -1;

  classroomSchedule$!: BehaviorSubject<ScheduleTransport>;
  classrooms!: Classroom[];
  selectedClassroom$: BehaviorSubject<Classroom> = new BehaviorSubject<Classroom>({} as Classroom);
  classroomName: string = '';

  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private scheduleDataService: ScheduleDataService,
    private departmentService: DepartmentService,
    private classroomService: ClassroomService,
    private scheduleRouteService: ScheduleRouteService,
  ) {
    this.classroomSchedule$ = new BehaviorSubject({} as ScheduleTransport);
  }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
      this.scheduleId = Number(params.get('scid')) || -1;
      this.classroomId = Number(params.get('cid')) || -1;
      this.departmentId = this.scheduleRouteService.getDepartmentId(this.activatedRoute);

      this.getInitialClassroom(this.classroomId);
      this.getScheduleForClassroom(this.scheduleId, this.classroomId);

      if (this.departmentId !== -1 && this.departmentId !== this.loadedClassroomsDepartmentId) {
        this.loadedClassroomsDepartmentId = this.departmentId;
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
    if (scheduleId === -1 || classroomId === -1) {
      console.warn('Cannot load classroom schedule because route ids are invalid', {
        scheduleId,
        classroomId,
        departmentId: this.departmentId,
      });
      return;
    }

    this.scheduleDataService
      .getScheduleForClassroom(scheduleId, classroomId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (schedule) => {
          this.classroomSchedule$.next(schedule);
        },
      });
  }
  loadClassroomSchedule(classroom: Classroom) {
    this.classroomName = classroom.name;
    this.selectedClassroom$.next(classroom);
    this.router.navigate(this.scheduleRouteService.getScheduleEntityRoute(this.departmentId, this.scheduleId, 'classrooms', classroom.id));
  }

  getInitialClassroom(classroomId: number) {
    if (classroomId === -1) {
      console.warn('Cannot load initial classroom because classroomId is invalid', {
        classroomId,
      });
      return;
    }

    this.classroomService
      .get(classroomId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (classroom: Classroom) => {
          this.selectedClassroom$.next(classroom);
          this.classroomName = classroom.name;
        },
      });
  }

  goBack() {
    if (this.departmentId !== -1) {
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
