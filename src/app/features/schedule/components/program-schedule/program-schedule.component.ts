import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ScheduleTransport } from '../../shared/models/schedule';
import { EventTransport } from '../../shared/models/event';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DAY } from '../../../../shared/models/timeslots';
import { ScheduleGroupingService } from '../../services/schedule-grouping.service';

interface A {
    semester: number;
    schedulePerDay: Map<DAY, ScheduleTransport>;
}

@Component({
    selector: 'app-program-schedule',
    standalone: false,
    templateUrl: './program-schedule.component.html',
})
export class ProgramScheduleComponent implements OnInit, OnDestroy {
    @Input()
    programSchedule$!: BehaviorSubject<ScheduleTransport>;

    programSchedulePerSemesterMap$: BehaviorSubject<Map<number, ScheduleTransport>>;
    emptyScheduleTransport: ScheduleTransport;

    days: DAY[] = Object.values(DAY);
    programSchedulePerDayArray!: A[];

    destroyed$: Subject<void> = new Subject<void>();
    selectedSemester: number = -1;

    getSchedulePerSemester(semester: number) {
        const scheduleMap = this.programSchedulePerDayArray.filter((e) => e.semester == semester)[0];
        return scheduleMap ? scheduleMap.schedulePerDay : new Map<DAY, ScheduleTransport>();
    }
    constructor(private scheduleGroupingService: ScheduleGroupingService) {
        this.emptyScheduleTransport = { id: 0, semester: '', events: [], fitness: 1, creationDate: new Date() };
        this.programSchedulePerDayArray = [];
        this.programSchedulePerSemesterMap$ = new BehaviorSubject<Map<number, ScheduleTransport>>(new Map());
    }

    ngOnInit(): void {
        this.programSchedule$.pipe(takeUntil(this.destroyed$)).subscribe((schedule: ScheduleTransport) => {
            console.log('Program schedule received:', schedule);
            if (schedule && schedule.events && schedule.events.length > 0) {
                const semesterMap = this.setProgramSchedulePerSemesterMap(schedule);
                this.programSchedulePerSemesterMap$.next(semesterMap);
                this.setSchedulePerDay(semesterMap);
            } else {
                console.warn('No events in program schedule or schedule is empty');
                this.programSchedulePerSemesterMap$.next(new Map());
            }
        });
    }

    setSchedulePerDay(map: Map<number, ScheduleTransport>) {
        map.forEach((key, value) => {
            this.programSchedulePerDayArray.push({
                semester: value,
                schedulePerDay: this.scheduleGroupingService.groupEventsByDayAndSortByTimeslot(key),
            });
        });
    }

    setProgramSchedulePerSemesterMap(schedule: ScheduleTransport): Map<number, ScheduleTransport> {
        return schedule.events.reduce((acc: Map<number, ScheduleTransport>, event: EventTransport) => {
            const { semester } = event.subjectTransport;
            if (!acc.has(semester)) {
                acc.set(semester, { id: 0, semester: '', events: [], fitness: 1, creationDate: new Date() });
            }
            acc.get(semester)?.events.push(event);
            return acc;
        }, new Map<number, ScheduleTransport>());
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
