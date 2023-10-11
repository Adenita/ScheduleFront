import { Injectable } from '@angular/core';
import { EventTransport } from '../../shared/models/event';
import { Schedule } from '../../shared/models/schedule';
import { ProgramDetailsTransport } from '../../shared/models/program';
import { SubjectDetailsTransport } from '../../shared/models/subject';
import { GroupType, StudentGroupTransport } from '../../shared/models/student-group';
import { Timeslot } from '../../shared/models/timeslots';
import { Classroom } from '../../shared/models/classroom';
import { ProfessorTransport, Role } from '../../shared/models/professor';
import { DepartmentDetailTransport } from '../../shared/models/department';

type ConflictType = {
  event: EventTransport;
  nextEvent: EventTransport;
  message: string;
};

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  numberOfConflicts: number = 0;
  private count: number = 0;
  private static scheduleCount: number = 0;

  initialize(departmentTransport: DepartmentDetailTransport): Schedule {
    const schedule: Schedule = new Schedule();

    const timeslots: Timeslot[] = departmentTransport.timeslots;
    const classrooms: Classroom[] = departmentTransport.classrooms;

    departmentTransport.programTransports.forEach((programDetails: ProgramDetailsTransport) => {
      programDetails.subjectsTransport.forEach((subjectDetails: SubjectDetailsTransport) => {
        subjectDetails.studentGroups.forEach((studentGroup: StudentGroupTransport) => {
          const event: EventTransport = {} as EventTransport;
          event.studentGroupTransport = studentGroup;
          event.subjectTransport = subjectDetails;
          event.programTransport = programDetails;
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

  getSubjectProfessorByRole(professors: ProfessorTransport[], role: Role) {
    if (professors.length == 1) return professors[0];
    const filteredProfessors: ProfessorTransport[] = professors.filter((professor) => professor.role.includes(role));
    return filteredProfessors[0];
  }

  getClassroomForStudentGroup(classrooms: Classroom[], studentGroup: StudentGroupTransport, subject: SubjectDetailsTransport): Classroom {
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
    schedule.events.forEach((event: EventTransport): void => {
      //@todo Add soft constraints such as preferred start time
      schedule.events.forEach((nextEvent: EventTransport): void => {
        if (nextEvent.id > event.id) {
          if (this.hasOverlap(event.timeslot, nextEvent.timeslot)) {
            if (event.classroom.id === nextEvent.classroom.id) {
              this.numberOfConflicts++;
              event.conflict = true;
              const conflict: ConflictType = {
                event,
                nextEvent,
                message:
                  'Classroom Conflict: ' +
                  event.classroom.name +
                  ' Day: ' +
                  event.timeslot.day +
                  ' Start: ' +
                  event.timeslot.startHour +
                  ':' +
                  event.timeslot.startMinute,
              };
              schedule.conflicts.push(conflict);
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
            }
          }
        }
      });
    });

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
