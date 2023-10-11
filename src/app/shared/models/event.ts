import { Timeslot } from './timeslots';
import { ProfessorTransport } from './professor';
import { SubjectTransport } from './subject';
import { Classroom } from './classroom';
import { StudentGroupTransport } from './student-group';
import { ProgramTransport } from './program';

export interface EventTransport {
  id: number;
  studentGroupTransport: StudentGroupTransport;
  programTransport: ProgramTransport;
  subjectTransport: SubjectTransport;
  professorTransport: ProfessorTransport;
  classroom: Classroom;
  timeslot: Timeslot;
  conflict: boolean;
}
