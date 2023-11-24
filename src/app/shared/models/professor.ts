import { SubjectTransport } from './subject';
import { DAY } from './timeslots';
export interface ProfessorTransport {
  id: number;
  name: string;
  role: Role;
  creationDate: Date;
  modificationDate: Date;
}

export interface ProfessorScheduleTransport {
  id: number;
  name: string;
  role: Role;
  preferredDays: ProfessorPreferredDay[];
}

export interface ProfessorPreferredDay {
  day: DAY;
  preferredStartHour: number;
  preferredStartMinute: number;
  preferredEndHour: number;
  preferredEndMinute: number;
}

export interface ProfessorDetailsTransport {
  id: number;
  name: string;
  role: Role;
  preferredDays: ProfessorPreferredDay[];
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
