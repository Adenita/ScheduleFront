import { DepartmentTransport } from './department';
import { Role } from './user';
import { Rank } from './professor';

export interface RegisterTransport {
  name: string;
  username: string;
  password: string;
  role: Role;
  rank: Rank;
  department: DepartmentTransport;
}

export interface LoginTransport {
  username: string;
  password: string;
}

export interface TokenTransport {
  token: string;
  username: string;
  roles: Role[];
}
