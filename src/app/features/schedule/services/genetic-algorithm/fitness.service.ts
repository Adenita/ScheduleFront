import { Schedule, ScheduleTransport } from '../../shared/models/schedule';
import { EventTransport } from '../../shared/models/event';
import { ProfessorPreferredDay, ProfessorTransport } from '../../../../shared/models/professor';
import { GroupType, StudentGroupTransport } from '../../../../shared/models/student-group';
import { Timeslot } from '../../../../shared/models/timeslots';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FitnessService {
  numberOfConflicts: number = 0;

  getFreeSlots(professor: ProfessorTransport, schedule: ScheduleTransport) {}

  calculateFitness(schedule: Schedule): number {
    schedule.conflicts = [];
    this.numberOfConflicts = 0;
    for (let i = 0; i < schedule.events.length; i++) {
      const event: EventTransport = schedule.events[i];
      event.conflict = false;
      if (event.professorTransport.preferredDays && event.professorTransport.preferredDays.length > 0) {
        const matchedPreferredDay: ProfessorPreferredDay | undefined = this.findMatchedEventProfessorPreferredDays(event);
        if (!matchedPreferredDay) {
          event.conflict = true;
          continue;
        } else {
          if (this.isEventMatchingPreferredTime(event, matchedPreferredDay)) {
            event.conflict = true;
            continue;
          }
        }
      }

      for (let j = i + 1; j < schedule.events.length; j++) {
        const nextEvent: EventTransport = schedule.events[j];
        if (this.hasOverlap(event.timeslot, nextEvent.timeslot, 5)) {
          if (event.classroom.id === nextEvent.classroom.id) {
            this.numberOfConflicts++;
            event.conflict = true;
            schedule.conflicts.push({ event, nextEvent, message: 'Classroom Conflict' });
            break;
          }
          if (event.professorTransport.id === nextEvent.professorTransport.id) {
            this.numberOfConflicts++;
            event.conflict = true;
            schedule.conflicts.push({ event, nextEvent, message: 'Professor Conflict' });
            break;
          }
          if (event.studentGroupTransport.id === nextEvent.studentGroupTransport.id) {
            this.numberOfConflicts++;
            event.conflict = true;
            schedule.conflicts.push({ event, nextEvent, message: 'StudentGroup Conflict' });
            break;
          }
          if (event.studentGroupTransport.semester === nextEvent.studentGroupTransport.semester) {
            if (this.doStudentGroupsOverlap(event.studentGroupTransport, nextEvent.studentGroupTransport)) {
              this.numberOfConflicts++;
              event.conflict = true;
              schedule.conflicts.push({ event, nextEvent, message: 'StudentGroup Conflict' });
              break;
            }
          }
        }
      }
    }
    return 1 / (this.numberOfConflicts + 1);
  }

  private findMatchedEventProfessorPreferredDays(event: EventTransport): ProfessorPreferredDay | undefined {
    return event.professorTransport.preferredDays.find(
      (preferredDay: ProfessorPreferredDay) => preferredDay.day === event.timeslot.day,
    );
  }

  private isEventMatchingPreferredTime(event: EventTransport, preferredTime: ProfessorPreferredDay): boolean {
    return (
      event.timeslot.startHour * 60 + event.timeslot.startMinute <
        preferredTime.preferredStartHour * 60 + preferredTime.preferredStartMinute ||
      event.timeslot.endHour * 60 + event.timeslot.endMinute >
        preferredTime.preferredEndHour * 60 + preferredTime.preferredEndMinute
    );
  }

  private doStudentGroupsOverlap(studentGroup1: StudentGroupTransport, studentGroup2: StudentGroupTransport): boolean {
    return (
      (studentGroup1.groupType === GroupType.LECTURE && studentGroup2.groupType === GroupType.EXERCISE) ||
      (studentGroup1.groupType === GroupType.EXERCISE && studentGroup2.groupType === GroupType.LECTURE)
    );
  }

  private hasOverlap(firstTimeslot: Timeslot, secondTimeslot: Timeslot, breakBetween: number): boolean {
    if (firstTimeslot.day === secondTimeslot.day) {
      const firstTimeslotStart: number = firstTimeslot.startHour * 60 + firstTimeslot.startMinute;
      const secondTimeslotStart: number = secondTimeslot.startHour * 60 + secondTimeslot.startMinute;
      const firstTimeslotEnd: number = firstTimeslot.endHour * 60 + firstTimeslot.endMinute;
      const secondTimeslotEnd: number = secondTimeslot.endHour * 60 + secondTimeslot.endMinute;

      if (firstTimeslotStart > secondTimeslotStart) {
        return secondTimeslotEnd >= firstTimeslotStart + breakBetween;
      }

      return firstTimeslotEnd + breakBetween >= secondTimeslotStart;
    }
    return false;
  }
}
