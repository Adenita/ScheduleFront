import { Injectable } from '@angular/core';
import { EventTransport } from '../../shared/models/event';
import { ConflictType, Schedule, ScheduleTransport } from '../../shared/models/schedule';
import { ProgramScheduleTransport, ProgramTransport } from '../../../../shared/models/program';
import { SubjectScheduleTransport, SubjectTransport } from '../../../../shared/models/subject';
import { GroupType, StudentGroupTransport } from '../../../../shared/models/student-group';
import { Timeslot } from '../../../../shared/models/timeslots';
import { Classroom } from '../../../../shared/models/classroom';
import { ProfessorPreferredDay, ProfessorScheduleTransport, Role } from '../../../../shared/models/professor';
import { DepartmentScheduleDetailTransport } from '../../../../shared/models/department';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  numberOfConflicts: number = 0;
  private count: number = 0;
  private static scheduleCount: number = 0;

  initialize(departmentTransport: DepartmentScheduleDetailTransport): Schedule {
    const schedule: Schedule = new Schedule();

    const timeslots: Timeslot[] = departmentTransport.timeslots;
    const classrooms: Classroom[] = departmentTransport.classrooms;

    departmentTransport.programTransports.forEach((programDetails: ProgramScheduleTransport) => {
      programDetails.subjectsTransport.forEach((subjectDetails: SubjectScheduleTransport) => {
        subjectDetails.studentGroups.forEach((studentGroup: StudentGroupTransport) => {
          const event: EventTransport = {} as EventTransport;
          event.studentGroupTransport = studentGroup;
          event.subjectTransport = this.getSubjectTransportForEvent(subjectDetails);
          event.programTransport = { id: programDetails.id, name: programDetails.name } as ProgramTransport;
          event.professorTransport =
            studentGroup.groupType === GroupType.EXERCISE
              ? this.getSubjectProfessorByRole(subjectDetails.professors, Role.ASSISTANT)
              : this.getSubjectProfessorByRole(subjectDetails.professors, Role.PROFESSOR);
          event.classroom = this.getClassroomForStudentGroup(classrooms, studentGroup, subjectDetails);

          event.timeslot = timeslots[this.getRandomIndex(timeslots.length)];

          event.id = this.count++;
          schedule.events.push(event);
        });
      });
    });

    schedule.fitness = this.calculateFitness(schedule);
    schedule.id = ScheduleService.scheduleCount++;
    return schedule;
  }

  getSubjectTransportForEvent(subjectDetails: SubjectScheduleTransport) {
    return {
      id: subjectDetails.id,
      name: subjectDetails.name,
      etcs: subjectDetails.etcs,
      requirementType: subjectDetails.requirementType,
      requiresLab: subjectDetails.requiresLab,
      semester: subjectDetails.semester,
      hours: subjectDetails.hours,
    } as SubjectTransport;
  }

  getSubjectProfessorByRole(professors: ProfessorScheduleTransport[], role: Role) {
    if (professors.length == 1) return professors[0];
    return professors.find((professor) => professor.role.includes(role))!;
  }

  getClassroomForStudentGroup(
    classrooms: Classroom[],
    studentGroup: StudentGroupTransport,
    subject: SubjectScheduleTransport,
  ): Classroom {
    const suitableClassrooms: Classroom[] = classrooms.filter((classroom) => {
      if (subject.requiresLab === 'Yes' || (subject.requiresLab === 'Exercise only' && studentGroup.groupType === 'Exercise')) {
        return classroom.hasComputers && studentGroup.numberOfStudents <= classroom.numberOfSeats;
      } else {
        return !classroom.hasComputers && studentGroup.numberOfStudents <= classroom.numberOfSeats;
      }
    });

    const randomIndex = this.getRandomIndex(suitableClassrooms.length);
    return suitableClassrooms[randomIndex];
  }

  calculateFitness(schedule: Schedule): number {
    schedule.conflicts = [];
    this.numberOfConflicts = 0;
    for (let i = 0; i < schedule.events.length; i++) {
      const event: EventTransport = schedule.events[i];
      event.conflict = false;
      //@todo Add soft constraints such as preferred start time
      if (event.professorTransport.preferredDays.length > 0) {
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
        if (this.hasOverlap(event.timeslot, nextEvent.timeslot)) {
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

  findMatchedEventProfessorPreferredDays(event: EventTransport): ProfessorPreferredDay | undefined {
    return event.professorTransport.preferredDays.find(
      (preferredDay: ProfessorPreferredDay) => preferredDay.day === event.timeslot.day,
    );
  }

  isEventMatchingPreferredTime(event: EventTransport, preferredTime: ProfessorPreferredDay): boolean {
    return (
      event.timeslot.startHour * 60 + event.timeslot.startMinute <
        preferredTime.preferredStartHour * 60 + preferredTime.preferredStartMinute ||
      event.timeslot.endHour * 60 + event.timeslot.endMinute >
        preferredTime.preferredEndHour * 60 + preferredTime.preferredEndMinute
    );
  }

  doStudentGroupsOverlap(studentGroup1: StudentGroupTransport, studentGroup2: StudentGroupTransport): boolean {
    return (
      (studentGroup1.groupType === GroupType.LECTURE && studentGroup2.groupType === GroupType.EXERCISE) ||
      (studentGroup1.groupType === GroupType.EXERCISE && studentGroup2.groupType === GroupType.LECTURE)
    );
  }

  hasOverlap(firstTimeslot: Timeslot, secondTimeslot: Timeslot): boolean {
    if (firstTimeslot.day === secondTimeslot.day) {
      const firstTimeslotStart: number = firstTimeslot.startHour * 60 + firstTimeslot.startMinute;
      const secondTimeslotStart: number = secondTimeslot.startHour * 60 + secondTimeslot.startMinute;
      const firstTimeslotEnd: number = firstTimeslot.endHour * 60 + firstTimeslot.endMinute;
      const secondTimeslotEnd: number = secondTimeslot.endHour * 60 + secondTimeslot.endMinute;

      if (firstTimeslotStart > secondTimeslotStart) {
        return secondTimeslotEnd >= firstTimeslotStart;
      }

      return firstTimeslotEnd >= secondTimeslotStart;
    }
    return false;
  }

  getRandomIndex(size: number): number {
    return Math.floor(Math.random() * size);
  }
}
