import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { ProgramDetailsTransport, ProgramListTransport, ProgramTransport } from '../../shared/models/program';
import { Observable } from 'rxjs';
import { SubjectListTransport, SubjectTransport } from '../../shared/models/subject';

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

  addSubjectToProgram(programId: number, subjectTransport: SubjectTransport) {
    return this.httpClient.post<SubjectTransport>(`${this.url}/${this.apiUrl}/${programId}/subjects`, subjectTransport);
  }

  getProgramDetails(programId: number): Observable<ProgramDetailsTransport> {
    return this.httpClient.get<ProgramDetailsTransport>(`${this.url}/programs/${programId}/details`);
  }
}
