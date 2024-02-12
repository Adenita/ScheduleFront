import { DepartmentTransport } from './department';
import { Rank } from './professor';

export interface UserTransport {
  id: number;
  name: string;
  username: string;
  password: string;
  role: Role;
  rank: Rank;
  departmentTransport: DepartmentTransport;
  creationDate: Date;
  modificationDate: Date;
}

export enum Role {
  ADMIN = 'ADMIN',
  PROFESSOR = 'PROFESSOR',
}

export interface UserListTransport {
  userTransportList: UserTransport[];
}
