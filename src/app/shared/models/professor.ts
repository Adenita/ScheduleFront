import { SubjectTransport } from './subject';
import { DAY } from './timeslots';
export interface ProfessorTransport {
  id: number;
  name: string;
  rank: Rank;
  creationDate: Date;
  modificationDate: Date;
}

export interface ProfessorScheduleTransport {
  id: number;
  name: string;
  rank: Rank;
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
  rank: Rank;
  preferredDays: ProfessorPreferredDay[];
  subjectTransportList: SubjectTransport[];
}

export enum Rank {
  PROFESSOR = 'PROFESSOR',
  ASSISTANT = 'ASSISTANT',
  PROFESSOR_ASSISTANT = 'PROFESSOR_ASSISTANT',
}

export interface ProfessorListTransport {
  professorTransports: ProfessorTransport[];
}
