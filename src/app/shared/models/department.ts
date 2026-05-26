import { ProgramScheduleTransport, ProgramTransport } from './program';
import { ProfessorScheduleTransport, ProfessorTransport } from './professor';
import { Timeslot } from './timeslots';
import { Classroom } from './classroom';
import { SubjectTransport } from './subject';
import { StudentGroupTransport } from './student-group';

export interface DepartmentTransport {
  id: number;
  name: string;
  creationDate: Date;
  modificationDate: Date;
}

export interface DepartmentScheduleDetailTransport {
  id: number;
  name: string;
  programTransports: ProgramScheduleTransport[];
  classrooms: Classroom[];
  professorTransports: ProfessorScheduleTransport[];
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

export interface DepartmentDetailsListTransport {
  departmentTransportList: DepartmentDetailTransport[];
}

export interface DepartmentListTransport {
  departmentTransportList: DepartmentTransport[];
}
