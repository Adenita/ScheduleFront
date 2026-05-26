import { Injectable } from '@angular/core';
import { ScheduleTransport } from '../shared/models/schedule';
import { DAY, Timeslot } from '../../../shared/models/timeslots';

@Injectable({
  providedIn: 'root',
})
export class ScheduleGroupingService {
  groupEventsByDayAndSortByTimeslot(schedule: ScheduleTransport): Map<DAY, ScheduleTransport> {
    const groups = this.groupEventsByDay(schedule);
    groups.forEach((value) => {
      value.events.sort((event1, event2) => this.compareTimeslots(event1.timeslot, event2.timeslot));
    });

    return groups;
  }

  private groupEventsByDay(schedule: ScheduleTransport): Map<DAY, ScheduleTransport> {
    return schedule.events.reduce((grouped, event) => {
      const { day } = event.timeslot;
      if (!grouped.has(day)) {
        grouped.set(day, { id: 0, semester: '', events: [], fitness: 1, creationDate: new Date() });
      }
      grouped.get(day)!.events.push(event);
      return grouped;
    }, new Map<DAY, ScheduleTransport>());
  }

  private compareTimeslots(timeslot1: Timeslot, timeslot2: Timeslot): number {
    if (timeslot1.startHour !== timeslot2.startHour) {
      return timeslot1.startHour - timeslot2.startHour;
    }

    return timeslot1.startMinute - timeslot2.startMinute;
  }
}
