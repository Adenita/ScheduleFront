import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScheduleListTransport, ScheduleTransport } from '../../shared/models/schedule';
import { BehaviorSubject, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { DepartmentService } from '../../../../core/services/http/department.service';
import { DepartmentDetailTransport, DepartmentScheduleDetailTransport } from '../../../../shared/models/department';
import { ScheduleDataService } from '../../../../core/services/http/schedule-data.service';
import { EventTransport } from '../../shared/models/event';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParametersService } from '../../../../core/services/route-parameters.service';
import { PermissionService } from '../../../../auth/services/permission.service';
import { Role } from '../../../../shared/models/user';
import { ProfessorTransport } from '../../../../shared/models/professor';
import { SearchService } from '../../../../core/services/search.service';

@Component({
  selector: 'app-schedule-management',
  templateUrl: './schedule-management.component.html',
  styleUrls: ['./schedule-management.component.scss'],
})
export class ScheduleManagementComponent implements OnInit, OnDestroy {
  departmentId: number = -1;
  currentBestSchedule!: ScheduleTransport;
  departmentScheduleDetailTransport: DepartmentScheduleDetailTransport;
  departmentTransport: DepartmentDetailTransport;

  currentRoute: string = '';

  bestScheduleEvents$: BehaviorSubject<EventTransport[]>;
  schedules$: BehaviorSubject<ScheduleTransport[]>;
  destroyed$: Subject<void> = new Subject<void>();

  isAdmin: boolean = false;

  filteredProfessors$: BehaviorSubject<ProfessorTransport[]> = new BehaviorSubject<ProfessorTransport[]>([]);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private departmentService: DepartmentService,
    private scheduleDataService: ScheduleDataService,
    private routeParametersService: RouteParametersService,
    private permissionService: PermissionService,
    private searchService: SearchService,
  ) {
    this.departmentTransport = {} as DepartmentDetailTransport;
    this.departmentScheduleDetailTransport = {} as DepartmentScheduleDetailTransport;
    this.bestScheduleEvents$ = new BehaviorSubject<EventTransport[]>([]);
    this.schedules$ = new BehaviorSubject<ScheduleTransport[]>([]);
  }

  ngOnInit() {
    this.routeParametersService.getNavigationEvent(this.router, this.activatedRoute, this.destroyed$).subscribe({
      next: (e) => {
        this.departmentId = this.routeParametersService.departmentId;
        this.currentRoute = this.routeParametersService.currentRoute;
        this.getDepartmentData().then((departmentData) => {
          this.departmentTransport = departmentData;
          this.filteredProfessors$.next(this.departmentTransport.professorTransports);
        });
        this.getDepartmentScheduleDetails().then((departmentData) => (this.departmentScheduleDetailTransport = departmentData));
        if (this.departmentId == -1) this.getSchedules();
        else this.getDepartmentSchedules(this.departmentId);
      },
    });
    this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
  }

  onSearch(event: any) {
    this.searchService.onSearch(event, this.filteredProfessors$, this.departmentTransport.professorTransports);
  }

  navigateToPage(path: string, id: number) {
    this.router.navigate([this.currentRoute, this.currentBestSchedule.id, path, id]);
  }

  async getDepartmentScheduleDetails() {
    return await firstValueFrom(this.departmentService.getDepartmentScheduleDetails(this.departmentId));
  }

  async getDepartmentData() {
    return await firstValueFrom(this.departmentService.getDepartmentDetails(this.departmentId));
  }

  getSchedules(): void {
    this.scheduleDataService
      .getAll()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (scheduleListTransport: ScheduleListTransport) => {
          const schedules = scheduleListTransport.scheduleTransports;
          this.schedules$.next(schedules);
          this.currentBestSchedule = schedules[schedules.length - 1];
        },
        error: (err) => console.error('Error fetching schedules', err),
      });
  }

  getDepartmentSchedules(departmentId: number) {
    this.scheduleDataService
      .getDepartmentSchedules(departmentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (scheduleListTransport: ScheduleListTransport) => {
          const schedules = scheduleListTransport.scheduleTransports;
          this.schedules$.next(schedules);
          this.currentBestSchedule = schedules[schedules.length - 1];
        },
        error: (err) => console.error('Error fetching schedules', err),
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
