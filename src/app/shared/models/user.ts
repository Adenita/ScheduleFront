import { DepartmentTransport } from './department';

export interface UserTransport {
  id: number;
  name: string;
  username: string;
  password: string;
  role: Role;
  departmentTransport: DepartmentTransport;
  creationDate: Date;
  modificationDate: Date;
}

export enum Role {
  ADMIN = 'ADMIN',
  PROFESSOR = 'PROFESSOR',
}

export interface UserListTransport {
  userTransports: UserTransport[];
}
