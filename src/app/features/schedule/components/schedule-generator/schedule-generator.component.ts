import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScheduleListTransport, ScheduleTransport } from '../../shared/models/schedule';
import { DepartmentScheduleDetailTransport } from '../../../../shared/models/department';
import { BehaviorSubject, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { EventTransport } from '../../shared/models/event';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from '../../../../core/services/http/department.service';
import { ScheduleDataService } from '../../../../core/services/http/schedule-data.service';
import { RouteParametersService } from '../../../../core/services/route-parameters.service';
import { ScheduleGenerationService } from '../../services/schedule-generation.service';
import { ScheduleGenerationModalComponent } from '../schedule-generation-modal/schedule-generation-modal.component';

@Component({
  selector: 'app-schedule-generator',
  templateUrl: './schedule-generator.component.html',
  styleUrls: ['./schedule-generator.component.scss'],
})
export class ScheduleGeneratorComponent implements OnInit, OnDestroy {
  departmentId: number = -1;
  currentBestSchedule!: ScheduleTransport;
  departmentScheduleDetailTransport: DepartmentScheduleDetailTransport;
  bestScheduleEvents$: BehaviorSubject<EventTransport[]>;
  schedules$: BehaviorSubject<ScheduleTransport[]>;

  populationSize: number = 200;
  generation: number = 1;

  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private departmentService: DepartmentService,
    private scheduleDataService: ScheduleDataService,
    private routeParametersService: RouteParametersService,
    private generateBestScheduleService: ScheduleGenerationService,
  ) {
    this.departmentScheduleDetailTransport = {} as DepartmentScheduleDetailTransport;
    this.bestScheduleEvents$ = new BehaviorSubject<EventTransport[]>([]);
    this.schedules$ = new BehaviorSubject<ScheduleTransport[]>([]);
  }

  ngOnInit() {
    console.log('ON INIT');
    this.routeParametersService.getNavigationEvent(this.router, this.activatedRoute, this.destroyed$).subscribe({
      next: (e) => {
        this.departmentId = this.routeParametersService.departmentSchedulesId;
        console.log(this.departmentId);
        this.getDepartmentScheduleDetails()
          .then((departmentData) => {
            this.departmentScheduleDetailTransport = departmentData;
          })
          .then(() => this.getDepartmentSchedules(this.departmentId));
      },
    });
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

  selectSchedule(schedule: ScheduleTransport) {
    this.currentBestSchedule = schedule;
  }

  async getDepartmentScheduleDetails() {
    return await firstValueFrom(this.departmentService.getDepartmentScheduleDetails(this.departmentId));
  }

  getDepartmentSchedules(departmentId: number) {
    this.scheduleDataService
      .getDepartmentSchedules(departmentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (scheduleListTransport: ScheduleListTransport) => {
          const schedules = scheduleListTransport.scheduleTransports;
          this.schedules$.next(schedules);
          if (schedules.length > 0) {
            this.currentBestSchedule = schedules[schedules.length - 1];
            this.bestScheduleEvents$.next(this.currentBestSchedule.events);
          } else {
            this.bestScheduleEvents$.next([]);
          }
        },
        error: (err) => console.error('Error fetching schedules', err),
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
