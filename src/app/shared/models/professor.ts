import { SubjectTransport } from './subject';

export interface ProfessorTransport {
  id: number;
  name: string;
  role: Role;
}

export interface ProfessorDetailsTransport {
  id: number;
  name: string;
  role: Role;
  subjectTransportList: SubjectTransport[];
}

export enum Role {
  PROFESSOR = 'Professor',
  ASSISTANT = 'Assistant',
  PROFESSOR_ASSISTANT = 'Professor assistant',
}

export interface ProfessorListTransport {
  professorTransports: ProfessorTransport[];
}
