export interface Professor {
  id: number;
  name: string;
  role: Role;
}

export enum Role {
  PROFESSOR = "Professor",
  ASSISTANT = "Assistant",
  PROFESSOR_ASSISTANT = "Professor assistant",
}

export interface ProfessorTransport {
  professors: Professor[];
}
