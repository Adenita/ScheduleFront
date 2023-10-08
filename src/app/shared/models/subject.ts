import { ProfessorTransport } from './professor';
import { StudentGroupTransport } from './student-group';

export enum LabRequirement {
  YES = 'Yes',
  NO = 'No',
  EXERCISE_ONLY = 'Exercise only',
}

export interface SubjectTransport {
  id: number;
  name: string;
  etcs: number;
  requiresLab: LabRequirement;
  semester: number;
}

export interface SubjectDetailsTransport {
  id: number;
  name: string;
  etcs: number;
  requiresLab: LabRequirement;
  semester: number;
  professors: ProfessorTransport[];
  studentGroups: StudentGroupTransport[];
}

export interface SubjectListTransport {
  subjects: SubjectTransport[];
}

export interface SubjectDetailsListTransport {
  subjectDetails: SubjectDetailsTransport[];
}
