import { Timeslot } from '../../../../shared/models/timeslots';
import { ProfessorScheduleTransport } from '../../../../shared/models/professor';
import { SubjectTransport } from '../../../../shared/models/subject';
import { Classroom } from '../../../../shared/models/classroom';
import { StudentGroupTransport } from '../../../../shared/models/student-group';
import { ProgramTransport } from '../../../../shared/models/program';

export interface EventTransport {
  id: number;
  studentGroupTransport: StudentGroupTransport;
  programTransport: ProgramTransport;
  subjectTransport: SubjectTransport;
  professorTransport: ProfessorScheduleTransport;
  classroom: Classroom;
  timeslot: Timeslot;
  conflict: boolean;
}
