import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {DataService} from "../services/data.service";
import {Department, DepartmentTransport} from "../../shared/models/department";
import {Observable} from "rxjs";
import {ProgramsTransport} from "../../shared/models/program";


@Injectable({
  providedIn: 'root',
})
export class DepartmentService extends DataService<Department, DepartmentTransport>{
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.apiUrl = "departments";
  }

  getProgramsPerDepartment(departmentId: number): Observable<ProgramsTransport> {
    return this.httpClient.get<ProgramsTransport>(`${this.url}/${this.apiUrl}/${departmentId}/programs`);
  }

  getDepartmentDetails(departmentId: number): Observable<DepartmentTransport> {
    return this.httpClient.get<DepartmentTransport>(`${this.url}/${this.apiUrl}/${departmentId}/details`);
  }
}
