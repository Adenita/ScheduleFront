import { StudentGroupTransport } from './student-group';
import { SubjectDetailsTransport } from './subject';

export interface ProgramTransport {
  id: number;
  name: string;
}

export interface ProgramDetailsTransport {
  id: number;
  name: string;
  subjectsTransport: SubjectDetailsTransport[];
  studentsGroupsDetailsTransports: StudentGroupTransport[];
}

export interface ProgramListTransport {
  programTransports: ProgramTransport[];
}

export interface ProgramsDetailsListTransport {
  programsDetails: ProgramDetailsTransport[];
}
