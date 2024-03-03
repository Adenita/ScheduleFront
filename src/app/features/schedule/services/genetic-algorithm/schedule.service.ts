import { Injectable } from '@angular/core';
import { EventTransport } from '../../shared/models/event';
import { Schedule } from '../../shared/models/schedule';
import { ProgramScheduleTransport, ProgramTransport } from '../../../../shared/models/program';
import { SubjectScheduleTransport, SubjectTransport } from '../../../../shared/models/subject';
import { GroupType, StudentGroupTransport } from '../../../../shared/models/student-group';
import { Timeslot } from '../../../../shared/models/timeslots';
import { Classroom } from '../../../../shared/models/classroom';
import { ProfessorScheduleTransport, Rank } from '../../../../shared/models/professor';
import { DepartmentScheduleDetailTransport } from '../../../../shared/models/department';
import { FitnessService } from './fitness.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private count: number = 0;
  private static scheduleCount: number = 0;
  constructor(private fitnessService: FitnessService) {}

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
              ? this.getSubjectProfessorByRole(subjectDetails.professors, Rank.ASSISTANT)
              : this.getSubjectProfessorByRole(subjectDetails.professors, Rank.PROFESSOR);
          event.classroom = this.getClassroomForStudentGroup(classrooms, studentGroup, subjectDetails);

          event.timeslot = timeslots[this.getRandomIndex(timeslots.length)];

          event.id = this.count++;
          schedule.events.push(event);
        });
      });
    });

    schedule.fitness = this.fitnessService.calculateFitness(schedule);
    schedule.id = ScheduleService.scheduleCount++;
    return schedule;
  }

  private getSubjectTransportForEvent(subjectDetails: SubjectScheduleTransport) {
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

  private getSubjectProfessorByRole(professors: ProfessorScheduleTransport[], rank: Rank) {
    if (professors.length == 1) return professors[0];
    return professors.find((professor) => professor.rank.includes(rank))!;
  }

  private getClassroomForStudentGroup(
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

  private getRandomIndex(size: number): number {
    return Math.floor(Math.random() * size);
  }
}
