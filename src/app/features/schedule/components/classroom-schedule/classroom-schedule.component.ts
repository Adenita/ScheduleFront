import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ScheduleTransport } from '../../shared/models/schedule';
import { DAY, Timeslot } from '../../../../shared/models/timeslots';

@Component({
  selector: 'app-classroom-schedule',
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

  constructor() {
    this.emptyScheduleTransport = { id: 0, semester: '', events: [], fitness: 1, creationDate: new Date() };
  }

  ngOnInit(): void {
    this.classroomSchedule$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (schedule: ScheduleTransport) => {
        if (schedule.events) {
          this.classroomSchedulePerDayMap = this.groupEventsByDay(schedule);
          this.sortGroupedEventsByTimeSlot(this.classroomSchedulePerDayMap);
        }
      },
    });
  }

  groupEventsByDay(schedule: ScheduleTransport): Map<DAY, ScheduleTransport> {
    return schedule.events.reduce((grouped, event) => {
      const { day } = event.timeslot;
      if (!grouped.has(day)) {
        grouped.set(day, { id: 0, semester: '', events: [], fitness: 1, creationDate: new Date() });
      }
      grouped.get(day)!.events.push(event);
      return grouped;
    }, new Map<DAY, ScheduleTransport>());
  }

  sortGroupedEventsByTimeSlot(groups: Map<DAY, ScheduleTransport>): void {
    groups.forEach((value) => {
      value.events.sort((event1, event2) => this.compareTimeslots(event1.timeslot, event2.timeslot));
    });
  }

  compareTimeslots(timeslot1: Timeslot, timeslot2: Timeslot): number {
    if (timeslot1.startHour !== timeslot2.startHour) {
      return timeslot1.startHour - timeslot2.startHour;
    }

    return timeslot1.startMinute - timeslot2.startMinute;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
