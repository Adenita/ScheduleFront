import {ProgramDetails} from "./program";
import {Professor} from "./professor";
import {Timeslot} from "./time-slots";
import {Classroom} from "./classroom";

export interface Department {
  id: number;
  name: string;
}

export interface DepartmentTransport {
  departments: Department[];
}

export interface DepartmentTransport{
  id: number;
  name: string;
  programTransports: ProgramDetails[];
  classrooms: Classroom[];
  professorTransports: Professor[];
  timeslots: Timeslot[];
}
