import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ScheduleTransport } from '../../shared/models/schedule';
import { EventTransport } from '../../shared/models/event';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-program-schedule',
  templateUrl: './program-schedule.component.html',
  styleUrls: ['./program-schedule.component.css'],
})
export class ProgramScheduleComponent implements OnInit, OnDestroy {
  @Input()
  programSchedule$!: BehaviorSubject<ScheduleTransport>;

  programSchedulePerSemesterMap!: Map<number, ScheduleTransport>;

  destroyed$: Subject<void> = new Subject<void>();
  ngOnInit(): void {
    this.programSchedule$.pipe(takeUntil(this.destroyed$)).subscribe((schedule: ScheduleTransport) => {
      if (schedule.events) {
        this.setProgramSchedulePerSemesterMap(schedule);
      }
    });
  }
  setProgramSchedulePerSemesterMap(schedule: ScheduleTransport) {
    this.programSchedulePerSemesterMap = schedule.events.reduce((acc: Map<number, ScheduleTransport>, event: EventTransport) => {
      const { semester } = event.subjectTransport;
      if (!acc.has(semester)) {
        acc.set(semester, { events: [], fitness: 1, creationDate: new Date() });
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
