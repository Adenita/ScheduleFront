import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScheduleTransport } from '../../shared/models/schedule';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParametersService } from '../../../../core/services/route-parameters.service';
import { ScheduleDataService } from '../../../../core/services/http/schedule-data.service';
import { DepartmentService } from '../../../../core/services/http/department.service';
import { ProgramTransport } from '../../../../shared/models/program';
import { ProgramService } from '../../../../core/services/http/program.service';

@Component({
  selector: 'app-program-schedule-management',
  standalone: false,
  templateUrl: './program-schedule-management.component.html',
  styleUrls: ['./program-schedule-management.component.css'],
})
export class ProgramScheduleManagementComponent implements OnInit, OnDestroy {
  scheduleId: number = -1;
  programId: number = -1;
  departmentId: number = -1;

  programSchedule$!: BehaviorSubject<ScheduleTransport>;
  programs!: ProgramTransport[];
  programName: string = '';
  selectedProgram$: BehaviorSubject<ProgramTransport> = new BehaviorSubject({} as ProgramTransport);

  currentRoute: string = '';
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private router: Router,
    private scheduleDataService: ScheduleDataService,
    private departmentService: DepartmentService,
    private programService: ProgramService,
  ) {
    this.programSchedule$ = new BehaviorSubject({} as ScheduleTransport);
  }
  ngOnInit() {
    this.getRouteParameters().then(() => {
      this.getInitialProgram(this.programId);
      this.getScheduleForProgram(this.scheduleId, this.programId);

      if (this.departmentId !== -1) {
        this.getDepartmentPrograms(this.departmentId);
      }
    });
  }

  getDepartmentPrograms(departmentId: number) {
    this.departmentService
      .getProgramsPerDepartment(departmentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (programListTransport) => {
          this.programs = programListTransport.programTransports;
        },
      });
  }

  getScheduleForProgram(scheduleId: number, programId: number) {
    if (scheduleId === -1 || programId === -1) {
      console.warn('Cannot load program schedule because route ids are invalid', {
        scheduleId,
        programId,
        departmentId: this.departmentId,
      });
      return;
    }

    this.scheduleDataService
      .getScheduleForProgram(scheduleId, programId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (schedule) => {
          this.programSchedule$.next(schedule);
        },
      });
  }

  getInitialProgram(programId: number) {
    if (programId === -1) {
      console.warn('Cannot load initial program because programId is invalid', {
        programId,
      });
      return;
    }

    this.programService
      .get(programId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (programTransport) => {
          this.programName = programTransport.name;
          this.selectedProgram$.next(programTransport);
        },
      });
  }

  getRouteParameters() {
    return this.routeParametersService.getCurrentRoute(this.activatedRoute).then(() => {
      this.scheduleId = this.routeParametersService.scheduleId;
      this.programId = this.routeParametersService.programId;
      this.departmentId = this.routeParametersService.departmentId;
      this.currentRoute = this.routeParametersService.currentRoute;
    });
  }

  loadProgramSchedule(program: ProgramTransport) {
    const currentRouteWithoutLastSlash: string = this.currentRoute.substring(0, this.currentRoute.length - 1);
    const lastIndexOfSlash: number = currentRouteWithoutLastSlash.lastIndexOf('/');
    const nextRoute: string = currentRouteWithoutLastSlash.substring(0, lastIndexOfSlash);
    this.programName = program.name;
    this.selectedProgram$.next(program);
    this.router.navigate([nextRoute, program.id]).then(() => this.getScheduleForProgram(this.scheduleId, program.id));
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
