import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScheduleListTransport, ScheduleTransport } from '../../shared/models/schedule';
import { BehaviorSubject, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { DepartmentService } from '../../../../core/services/http/department.service';
import { DepartmentDetailTransport, DepartmentScheduleDetailTransport } from '../../../../shared/models/department';
import { ScheduleDataService } from '../../../../core/services/http/schedule-data.service';
import { EventTransport } from '../../shared/models/event';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleGenerationModalComponent } from '../../components/schedule-generation-modal/schedule-generation-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParametersService } from '../../../../core/services/route-parameters.service';
import { ScheduleGenerationService } from '../../services/schedule-generation.service';
import { PermissionService } from '../../../../auth/services/permission.service';
import { Role } from '../../../../shared/models/user';

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

  populationSize: number = 200;
  generation: number = 1;
  bestScheduleEvents$: BehaviorSubject<EventTransport[]>;
  schedules$: BehaviorSubject<ScheduleTransport[]>;
  destroyed$: Subject<void> = new Subject<void>();

  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private departmentService: DepartmentService,
    private scheduleDataService: ScheduleDataService,
    private routeParametersService: RouteParametersService,
    private generateBestScheduleService: ScheduleGenerationService,
    private permissionService: PermissionService,
  ) {
    this.departmentTransport = {} as DepartmentDetailTransport;
    this.departmentScheduleDetailTransport = {} as DepartmentScheduleDetailTransport;
    this.bestScheduleEvents$ = new BehaviorSubject<EventTransport[]>([]);
    this.schedules$ = new BehaviorSubject<ScheduleTransport[]>([]);
  }

  ngOnInit() {
    this.getRouteParameters()
      .then(() => this.getDepartmentData())
      .then((departmentData) => (this.departmentTransport = departmentData))
      .then(() => this.getDepartmentScheduleDetails())
      .then((departmentData) => (this.departmentScheduleDetailTransport = departmentData))
      .then(() => {
        if (this.departmentId == -1) this.getSchedules();
        else this.getDepartmentSchedules(this.departmentId);
      });
    this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
  }

  openGenerateScheduleModal() {
    const modalRef = this.modalService.open(ScheduleGenerationModalComponent);
    modalRef.componentInstance.bestScheduleEvents$ = this.bestScheduleEvents$;
    modalRef.componentInstance.schedules$ = this.schedules$;
    modalRef.componentInstance.departmentId = this.departmentId;
    this.generateBestScheduleService.generateBestSchedule(
      this.generation,
      this.populationSize,
      this.departmentScheduleDetailTransport,
      this.bestScheduleEvents$,
    );
  }

  navigateToPage(path: string, id: number) {
    this.router.navigate([this.currentRoute, this.currentBestSchedule.id, path, id]);
  }

  selectSchedule(schedule: ScheduleTransport) {
    this.currentBestSchedule = schedule;
  }

  getRouteParameters() {
    return this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.currentRoute = this.routeParametersService.setRoute('schedules');
    });
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
