import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { ProgramDetailsTransport, ProgramListTransport, ProgramTransport } from '../../../shared/models/program';
import { Observable } from 'rxjs';
import { SubjectListTransport, SubjectTransport } from '../../../shared/models/subject';
import { StudentGroupListTransport, StudentGroupTransport } from '../../../shared/models/student-group';

@Injectable({
  providedIn: 'root',
})
export class ProgramService extends DataService<ProgramTransport, ProgramListTransport> {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  override get apiUrl(): string {
    return 'programs';
  }

  getSubjectsPerProgram(programId: number): Observable<SubjectListTransport> {
    return this.httpClient.get<SubjectListTransport>(`${this.url}/${this.apiUrl}/${programId}/subjects`);
  }

  postSubjectToProgram(programId: number, subjectTransport: SubjectTransport) {
    return this.httpClient.post<SubjectTransport>(`${this.url}/${this.apiUrl}/${programId}/subjects`, subjectTransport);
  }

  getStudentGroupsPerProgram(programId: number): Observable<StudentGroupListTransport> {
    return this.httpClient.get<StudentGroupListTransport>(`${this.url}/${this.apiUrl}/${programId}/student_groups`);
  }

  postStudentGroupToProgram(programId: number, studentGroupTransport: StudentGroupTransport) {
    return this.httpClient.post<StudentGroupTransport>(`${this.url}/${this.apiUrl}/${programId}/student_groups`, studentGroupTransport);
  }

  getProgramDetails(programId: number): Observable<ProgramDetailsTransport> {
    return this.httpClient.get<ProgramDetailsTransport>(`${this.url}/programs/${programId}/details`);
  }
}
