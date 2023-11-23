import { Injectable } from '@angular/core';
import { EventTransport } from '../../shared/models/event';
import { ConflictType, Schedule } from '../../shared/models/schedule';
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
        const matchedPreferredDay: ProfessorPreferredDay | undefined = event.professorTransport.preferredDays.find(
          (preferredDay: ProfessorPreferredDay) => preferredDay.day === event.timeslot.day,
        );
        if (!matchedPreferredDay) {
          event.conflict = true;
          continue;
        } else {
          if (
            event.timeslot.startHour * 60 + event.timeslot.startMinute <
              matchedPreferredDay.preferredStartHour * 60 + matchedPreferredDay.preferredStartMinute ||
            event.timeslot.endHour * 60 + event.timeslot.endMinute >
              matchedPreferredDay.preferredEndHour * 60 + matchedPreferredDay.preferredEndMinute
          ) {
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
            const conflict: ConflictType = {
              event,
              nextEvent,
              message: 'Classroom Conflict: ' + event.classroom.name,
            };
            schedule.conflicts.push(conflict);
            break;
          }
          if (event.professorTransport.id === nextEvent.professorTransport.id) {
            this.numberOfConflicts++;
            event.conflict = true;
            const conflict: ConflictType = {
              event,
              nextEvent,
              message: 'Professor Conflict: ' + event.professorTransport.name,
            };
            schedule.conflicts.push(conflict);
            break;
          }
          if (event.studentGroupTransport.id === nextEvent.studentGroupTransport.id) {
            this.numberOfConflicts++;
            event.conflict = true;
            const conflict: ConflictType = {
              event,
              nextEvent,
              message: 'StudentGroup Conflict: ' + event.studentGroupTransport.name,
            };
            schedule.conflicts.push(conflict);
            break;
          }
          if (event.studentGroupTransport.semester === nextEvent.studentGroupTransport.semester) {
            if (
              (event.studentGroupTransport.groupType === GroupType.LECTURE &&
                nextEvent.studentGroupTransport.groupType === GroupType.EXERCISE) ||
              (event.studentGroupTransport.groupType === GroupType.EXERCISE &&
                nextEvent.studentGroupTransport.groupType === GroupType.LECTURE)
            ) {
              this.numberOfConflicts++;
              event.conflict = true;
              const conflict: ConflictType = {
                event,
                nextEvent,
                message: 'StudentGroup Conflict: ' + event.studentGroupTransport.name,
              };
              schedule.conflicts.push(conflict);
              break;
            }
          }
        }
      }
    }
    return 1 / (this.numberOfConflicts + 1);
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
