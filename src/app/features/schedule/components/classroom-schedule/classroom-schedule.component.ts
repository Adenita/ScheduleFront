import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ScheduleTransport } from '../../shared/models/schedule';
import { DAY } from '../../../../shared/models/timeslots';
import { ScheduleGroupingService } from '../../services/schedule-grouping.service';

@Component({
  selector: 'app-classroom-schedule',
  standalone: false,
  templateUrl: './classroom-schedule.component.html',
})
export class ClassroomScheduleComponent implements OnInit, OnDestroy {
  @Input()
  classroomSchedule$!: BehaviorSubject<ScheduleTransport>;

  classroomSchedulePerDayMap$: BehaviorSubject<Map<DAY, ScheduleTransport>>;
  destroyed$: Subject<void> = new Subject<void>();
  emptyScheduleTransport: ScheduleTransport;
  days: DAY[] = Object.values(DAY);

  constructor(private scheduleGroupingService: ScheduleGroupingService) {
    this.emptyScheduleTransport = { id: 0, semester: '', events: [], fitness: 1, creationDate: new Date() };
    this.classroomSchedulePerDayMap$ = new BehaviorSubject<Map<DAY, ScheduleTransport>>(new Map());
  }

  ngOnInit(): void {
    this.classroomSchedule$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (schedule: ScheduleTransport) => {
        console.log('Classroom schedule received:', schedule);
        if (schedule && schedule.events && schedule.events.length > 0) {
          const dayMap = this.scheduleGroupingService.groupEventsByDayAndSortByTimeslot(schedule);
          this.classroomSchedulePerDayMap$.next(dayMap);
        } else {
          console.warn('No events in classroom schedule or schedule is empty');
          this.classroomSchedulePerDayMap$.next(new Map());
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
