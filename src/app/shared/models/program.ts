import { StudentGroupTransport } from './student-group';
import { SubjectDetailsTransport, SubjectScheduleTransport, SubjectTransport } from './subject';
import { ProfessorTransport } from './professor';

export interface ProgramTransport {
  id: number;
  name: string;
  creationDate: Date;
  modificationDate: Date;
}

export interface ProgramSubjectDetailsTransport {
  id: number;
  name: string;
  subjectsTransport: SubjectDetailsTransport[];
}

export interface ProgramScheduleTransport {
  id: number;
  name: string;
  subjectsTransport: SubjectScheduleTransport[];
}

export interface ProgramDetailsTransport {
  id: number;
  name: string;
  creationDate: Date;
  modificationDate: Date;
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
