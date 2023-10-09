import { ProgramDetailsTransport } from './program';
import { ProfessorTransport } from './professor';
import { Timeslot } from './timeslots';
import { Classroom } from './classroom';

export interface DepartmentTransport {
  id: number;
  name: string;
}

export interface DepartmentDetailTransport {
  id: number;
  name: string;
  programTransports: ProgramDetailsTransport[];
  classrooms: Classroom[];
  professorTransports: ProfessorTransport[];
  timeslots: Timeslot[];
}

export interface DepartmentListTransport {
  departmentTransportList: DepartmentDetailTransport[];
}

export interface DepartmentDetailsListTransport {
  departmentTransportList: DepartmentTransport[];
}
