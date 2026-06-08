import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScheduleTransport } from '../../shared/models/schedule';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleDataService } from '../../../../core/services/http/schedule-data.service';
import { DepartmentService } from '../../../../core/services/http/department.service';
import { ProgramTransport } from '../../../../shared/models/program';
import { ProgramService } from '../../../../core/services/http/program.service';
import { ScheduleRouteService } from '../../services/schedule-route.service';

@Component({
    selector: 'app-program-schedule-management',
    standalone: false,
    templateUrl: './program-schedule-management.component.html',
    styleUrls: ['./program-schedule-management.component.scss'],
})
export class ProgramScheduleManagementComponent implements OnInit, OnDestroy {
    scheduleId: number = -1;
    programId: number = -1;
    departmentId: number = -1;
    loadedProgramsDepartmentId: number = -1;

    programSchedule$!: BehaviorSubject<ScheduleTransport>;
    programs!: ProgramTransport[];
    programName: string = '';
    selectedProgram$: BehaviorSubject<ProgramTransport> = new BehaviorSubject({} as ProgramTransport);

    destroyed$: Subject<void> = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private scheduleDataService: ScheduleDataService,
        private departmentService: DepartmentService,
        private programService: ProgramService,
        private scheduleRouteService: ScheduleRouteService,
    ) {
        this.programSchedule$ = new BehaviorSubject({} as ScheduleTransport);
    }
    ngOnInit() {
        this.activatedRoute.paramMap.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
            this.scheduleId = Number(params.get('scid')) || -1;
            this.programId = Number(params.get('pid')) || -1;
            this.departmentId = this.scheduleRouteService.getDepartmentId(this.activatedRoute);

            this.getInitialProgram(this.programId);
            this.getScheduleForProgram(this.scheduleId, this.programId);

            if (this.departmentId !== -1 && this.departmentId !== this.loadedProgramsDepartmentId) {
                this.loadedProgramsDepartmentId = this.departmentId;
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

    loadProgramSchedule(program: ProgramTransport) {
        this.programName = program.name;
        this.selectedProgram$.next(program);
        this.router.navigate(
            this.scheduleRouteService.getScheduleEntityRoute(this.departmentId, this.scheduleId, 'programs', program.id),
        );
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
