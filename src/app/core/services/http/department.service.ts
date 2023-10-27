import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { DepartmentDetailTransport, DepartmentListTransport, DepartmentTransport } from '../../../shared/models/department';
import { Observable } from 'rxjs';
import { ProgramListTransport, ProgramTransport } from '../../../shared/models/program';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService extends DataService<DepartmentTransport, DepartmentListTransport> {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.apiUrl = 'departments';
  }

  getProgramsPerDepartment(departmentId: number): Observable<ProgramListTransport> {
    return this.httpClient.get<ProgramListTransport>(`${this.url}/${this.apiUrl}/${departmentId}/programs`);
  }

  postProgramToDepartment(departmentId: number, programTransport: ProgramTransport): Observable<ProgramTransport> {
    return this.httpClient.post<ProgramTransport>(`${this.url}/${this.apiUrl}/${departmentId}/programs`, programTransport);
  }

  getDepartmentDetails(departmentId: number): Observable<DepartmentDetailTransport> {
    return this.httpClient.get<DepartmentDetailTransport>(`${this.url}/${this.apiUrl}/${departmentId}/details`);
  }
}
