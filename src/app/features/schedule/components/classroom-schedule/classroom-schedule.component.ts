import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ScheduleTransport } from '../../shared/models/schedule';
import { DAY } from '../../../../shared/models/timeslots';
import { ScheduleGroupingService } from '../../services/schedule-grouping.service';

@Component({
  selector: 'app-classroom-schedule',
  standalone: false,
  templateUrl: './classroom-schedule.component.html',
  styleUrls: ['./classroom-schedule.component.css'],
})
export class ClassroomScheduleComponent implements OnInit, OnDestroy {
  @Input()
  classroomSchedule$!: BehaviorSubject<ScheduleTransport>;

  classroomSchedulePerDayMap!: Map<DAY, ScheduleTransport>;
  destroyed$: Subject<void> = new Subject<void>();
  emptyScheduleTransport: ScheduleTransport;
  days: DAY[] = Object.values(DAY);

  constructor(private scheduleGroupingService: ScheduleGroupingService) {
    this.emptyScheduleTransport = { id: 0, semester: '', events: [], fitness: 1, creationDate: new Date() };
  }

  ngOnInit(): void {
    this.classroomSchedule$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (schedule: ScheduleTransport) => {
        if (schedule.events) {
          this.classroomSchedulePerDayMap = this.scheduleGroupingService.groupEventsByDayAndSortByTimeslot(schedule);
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
