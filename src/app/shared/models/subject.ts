import { ProfessorTransport } from './professor';
import { StudentGroupTransport } from './student-group';

export enum LabRequirement {
  YES = 'Yes',
  NO = 'No',
  EXERCISE_ONLY = 'Exercise only',
}

export enum RequirementType {
  MANDATORY = 'Mandatory',
  OPTIONAL = 'Optional',
}

export enum Hours {
  ONE_TWO = '1+2',
  ONE_THREE = '1+3',
  TWO_ONE = '2+1',
  TWO_TWO = '2+2',
  TWO_THREE = '2+3',
  TWO_FOUR = '2+4',
  THREE_ONE = '3+1',
  THREE_TWO = '3+2',
  THREE_THREE = '3+3',
}

export interface SubjectTransport {
  id: number;
  name: string;
  etcs: number;
  requiresLab: LabRequirement;
  semester: number;
  requirementType: RequirementType;
  hours: Hours;
}

export interface SubjectDetailsTransport {
  id: number;
  name: string;
  etcs: number;
  requiresLab: LabRequirement;
  semester: number;
  requirementType: RequirementType;
  hours: Hours;
  professors: ProfessorTransport[];
  studentGroups: StudentGroupTransport[];
}

export interface SubjectListTransport {
  subjects: SubjectTransport[];
}

export interface SubjectDetailsListTransport {
  subjectDetails: SubjectDetailsTransport[];
}
