import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ScheduleTransport } from '../../shared/models/schedule';
import { ProfessorTransport } from '../../../../shared/models/professor';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParametersService } from '../../../../core/services/route-parameters.service';
import { ScheduleDataService } from '../../../../core/services/http/schedule-data.service';
import { DepartmentService } from '../../../../core/services/http/department.service';
import { ProfessorService } from '../../../../core/services/http/professor.service';

@Component({
  selector: 'app-professor-schedule-management',
  templateUrl: './professor-schedule-management.component.html',
  styleUrls: ['./professor-schedule-management.component.css'],
})
export class ProfessorScheduleManagementComponent implements OnInit, OnDestroy {
  scheduleId: number = -1;
  professorId: number = -1;
  departmentId: number = -1;

  professorSchedule$!: BehaviorSubject<ScheduleTransport>;
  professors!: ProfessorTransport[];
  professorName: string = '';

  currentRoute: string = '';
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private scheduleDataService: ScheduleDataService,
    private departmentService: DepartmentService,
    private professorService: ProfessorService,
  ) {
    this.professorSchedule$ = new BehaviorSubject({} as ScheduleTransport);
  }

  ngOnInit() {
    this.getRouteParameters()
      .then(() => this.getInitialProfessor(this.professorId))
      .then(() => this.getScheduleForProfessor(this.scheduleId, this.professorId))
      .then(() => {
        if (this.departmentId != -1) {
          this.getDepartmentProfessors(this.departmentId);
        }
      });
  }

  getDepartmentProfessors(departmentId: number) {
    this.departmentService
      .getProfessorsPerDepartment(departmentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (professorListTransport) => {
          this.professors = professorListTransport.professorTransports;
        },
      });
  }

  getScheduleForProfessor(scheduleId: number, professorId: number) {
    this.scheduleDataService
      .getScheduleForProfessor(scheduleId, professorId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (schedule) => {
          this.professorSchedule$.next(schedule);
        },
      });
  }

  getRouteParameters() {
    return this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
      this.scheduleId = this.routeParametersService.scheduleId;
      this.professorId = this.routeParametersService.professorId;
      this.departmentId = this.routeParametersService.departmentId;
      this.currentRoute = this.routeParametersService.setRoute('');
    });
  }

  loadProfessorSchedule(professor: ProfessorTransport) {
    const currentRouteWithoutLastSlash: string = this.currentRoute.substring(0, this.currentRoute.length - 1);
    const lastIndexOfSlash: number = currentRouteWithoutLastSlash.lastIndexOf('/');
    const nextRoute: string = currentRouteWithoutLastSlash.substring(0, lastIndexOfSlash);
    this.professorName = professor.name;
    this.router.navigate([nextRoute, professor.id]).then(() => this.getScheduleForProfessor(this.scheduleId, professor.id));
  }

  getInitialProfessor(professorId: number) {
    this.professorService
      .get(professorId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (professorTransport) => {
          this.professorName = professorTransport.name;
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
