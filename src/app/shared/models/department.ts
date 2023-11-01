import { ProgramSubjectDetailsTransport, ProgramTransport } from './program';
import { ProfessorTransport } from './professor';
import { Timeslot } from './timeslots';
import { Classroom } from './classroom';
import { SubjectTransport } from './subject';
import { StudentGroupTransport } from './student-group';

export interface DepartmentTransport {
  id: number;
  name: string;
}

export interface DepartmentScheduleDetailTransport {
  id: number;
  name: string;
  programTransports: ProgramSubjectDetailsTransport[];
  classrooms: Classroom[];
  professorTransports: ProfessorTransport[];
  timeslots: Timeslot[];
}

export interface DepartmentDetailTransport {
  id: number;
  name: string;
  programTransports: ProgramTransport[];
  subjectTransports: SubjectTransport[];
  studentGroupTransports: StudentGroupTransport[];
  classrooms: Classroom[];
  professorTransports: ProfessorTransport[];
}

export interface DepartmentListTransport {
  departmentTransportList: DepartmentDetailTransport[];
}

export interface DepartmentDetailsListTransport {
  departmentTransportList: DepartmentTransport[];
}
