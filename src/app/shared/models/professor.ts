export interface ProfessorTransport {
  id: number;
  name: string;
  role: Role;
}

export enum Role {
  PROFESSOR = 'Professor',
  ASSISTANT = 'Assistant',
  PROFESSOR_ASSISTANT = 'Professor assistant',
}

export interface ProfessorListTransport {
  professors: ProfessorTransport[];
}
