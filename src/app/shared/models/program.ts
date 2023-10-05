import {StudentGroup} from "./student-groups";
import {SubjectDetails} from "./subject";

export interface Program {
  id: number;
  name: string;
}

export interface ProgramDetails {
  id: number;
  name: string;
  subjectsTransport: SubjectDetails[],
  studentsGroupsDetailsTransports: StudentGroup[]
}

export interface ProgramsTransport {
  programTransports: Program[];
}

export interface ProgramsDetailsTransport {
  programsDetails: ProgramDetails[];
}
