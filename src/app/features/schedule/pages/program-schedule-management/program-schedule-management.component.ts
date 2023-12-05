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
    this.getRouteParameters()
      .then(() => this.getInitialProgram(this.programId))
      .then(() => this.getScheduleForProgram(this.scheduleId, this.programId))
      .then(() => {
        if (this.departmentId != -1) {
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
    this.programService
      .get(programId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (programTransport) => {
          this.programName = programTransport.name;
        },
      });
  }

  getRouteParameters() {
    return this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
      this.scheduleId = this.routeParametersService.scheduleId;
      this.programId = this.routeParametersService.programId;
      this.departmentId = this.routeParametersService.departmentId;
      this.currentRoute = this.routeParametersService.setRoute('');
    });
  }

  loadProgramSchedule(program: ProgramTransport) {
    const nextRoute = this.currentRoute.slice(0, this.currentRoute.length - 2);
    this.programName = program.name;
    this.router.navigate([nextRoute, program.id]).then(() => this.getScheduleForProgram(this.scheduleId, program.id));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
