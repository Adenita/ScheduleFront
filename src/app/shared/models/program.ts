import { StudentGroup } from './student-groups';
import { SubjectDetailsTransport } from './subject';

export interface ProgramTransport {
  id: number;
  name: string;
}

export interface ProgramDetailsTransport {
  id: number;
  name: string;
  subjectsTransport: SubjectDetailsTransport[];
  studentsGroupsDetailsTransports: StudentGroup[];
}

export interface ProgramListTransport {
  programTransports: ProgramTransport[];
}

export interface ProgramsDetailsListTransport {
  programsDetails: ProgramDetailsTransport[];
}
