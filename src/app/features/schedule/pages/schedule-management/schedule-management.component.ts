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
    standalone: false,
    templateUrl: './schedule-management.component.html',
    styleUrls: ['./schedule-management.component.scss'],
})
export class ScheduleManagementComponent implements OnInit, OnDestroy {
    departmentId: number = -1;
    currentBestSchedule$: BehaviorSubject<ScheduleTransport | null>;
    departmentScheduleDetailTransport: DepartmentScheduleDetailTransport;
    departmentTransport$: BehaviorSubject<DepartmentDetailTransport>;

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
        this.departmentTransport$ = new BehaviorSubject<DepartmentDetailTransport>({} as DepartmentDetailTransport);
        this.departmentScheduleDetailTransport = {} as DepartmentScheduleDetailTransport;
        this.bestScheduleEvents$ = new BehaviorSubject<EventTransport[]>([]);
        this.schedules$ = new BehaviorSubject<ScheduleTransport[]>([]);
        this.currentBestSchedule$ = new BehaviorSubject<ScheduleTransport | null>(null);
    }

    ngOnInit() {
        this.routeParametersService
            .getNavigationEvent(this.router, this.activatedRoute, this.destroyed$)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: () => {
                    this.departmentId = this.routeParametersService.departmentId;
                    this.currentRoute = this.routeParametersService.currentRoute;

                    this.getDepartmentData().then((departmentData) => {
                        console.log('department data: ', departmentData);
                        console.log('current best schedule: ', this.currentBestSchedule$.getValue());
                        this.departmentTransport$.next(departmentData);
                        this.filteredProfessors$.next(departmentData.professorTransports);
                    });

                    this.getDepartmentScheduleDetails().then(
                        (departmentData) => (this.departmentScheduleDetailTransport = departmentData),
                    );

                    if (this.departmentId === -1) {
                        this.getSchedules();
                    } else {
                        this.getDepartmentSchedules(this.departmentId);
                    }
                },
            });

        this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
    }

    onSearch(event: any) {
        const departmentData = this.departmentTransport$.getValue();
        this.searchService.onSearch(event, this.filteredProfessors$, departmentData.professorTransports);
    }

    navigateToPage(path: string, id: number) {
        const currentSchedule = this.currentBestSchedule$.getValue();
        if (currentSchedule) {
            this.router.navigate([this.currentRoute, currentSchedule.id, path, id]);
        } else {
            console.warn('No schedule available to navigate');
        }
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
                    const latestSchedule = schedules.length > 0 ? schedules[schedules.length - 1] : null;
                    this.currentBestSchedule$.next(latestSchedule);
                    console.log('All schedules loaded:', schedules, 'Latest:', latestSchedule);
                },
                error: (err) => console.error('Error fetching schedules', err),
            });
    }

    getDepartmentSchedules(departmentId: number) {
        console.log('Loading schedules for department:', departmentId);
        this.scheduleDataService
            .getDepartmentSchedules(departmentId)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (scheduleListTransport: ScheduleListTransport) => {
                    const schedules = scheduleListTransport.scheduleTransports;
                    this.schedules$.next(schedules);
                    const latestSchedule = schedules.length > 0 ? schedules[schedules.length - 1] : null;
                    this.currentBestSchedule$.next(latestSchedule);
                    console.log('Department schedules loaded:', schedules, 'Latest:', latestSchedule);
                },
                error: (err) => console.error('Error fetching department schedules', err),
            });
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
