import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ScheduleTransport } from '../../shared/models/schedule';
import { DAY } from '../../../../shared/models/timeslots';
import { ScheduleGroupingService } from '../../services/schedule-grouping.service';

@Component({
  selector: 'app-professor-schedule',
  standalone: false,
  templateUrl: './professor-schedule.component.html',
})
export class ProfessorScheduleComponent implements OnInit, OnDestroy {
  @Input()
  professorSchedule$!: BehaviorSubject<ScheduleTransport>;

  professorSchedulePerDayMap$: BehaviorSubject<Map<DAY, ScheduleTransport>>;
  destroyed$: Subject<void> = new Subject<void>();
  emptyScheduleTransport: ScheduleTransport;
  days: DAY[] = Object.values(DAY);

  constructor(private scheduleGroupingService: ScheduleGroupingService) {
    this.emptyScheduleTransport = { id: 0, semester: '', events: [], fitness: 1, creationDate: new Date() };
    this.professorSchedulePerDayMap$ = new BehaviorSubject<Map<DAY, ScheduleTransport>>(new Map());
  }

  ngOnInit(): void {
    this.professorSchedule$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (schedule: ScheduleTransport) => {
        console.log('Professor schedule received:', schedule);
        if (schedule && schedule.events && schedule.events.length > 0) {
          const dayMap = this.scheduleGroupingService.groupEventsByDayAndSortByTimeslot(schedule);
          this.professorSchedulePerDayMap$.next(dayMap);
        } else {
          console.warn('No events in professor schedule or schedule is empty');
          this.professorSchedulePerDayMap$.next(new Map());
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
