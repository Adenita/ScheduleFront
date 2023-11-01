import { StudentGroupTransport } from './student-group';
import { SubjectDetailsTransport, SubjectTransport } from './subject';
import { ProfessorTransport } from './professor';

export interface ProgramTransport {
  id: number;
  name: string;
}

export interface ProgramSubjectDetailsTransport {
  id: number;
  name: string;
  subjectsTransport: SubjectDetailsTransport[];
}

export interface ProgramDetailsTransport {
  id: number;
  name: string;
  subjectTransports: SubjectTransport[];
  studentGroupTransports: StudentGroupTransport[];
  professorTransports: ProfessorTransport[];
}

export interface ProgramListTransport {
  programTransports: ProgramTransport[];
}

export interface ProgramsDetailsListTransport {
  programsDetails: ProgramDetailsTransport[];
}
