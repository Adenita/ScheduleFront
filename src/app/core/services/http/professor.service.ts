import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { ProfessorDetailsTransport, ProfessorListTransport, ProfessorTransport } from '../../../shared/models/professor';
import { Observable } from 'rxjs';
import { SubjectListTransport, SubjectTransport } from '../../../shared/models/subject';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService extends DataService<ProfessorTransport, ProfessorListTransport> {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.apiUrl = 'professors';
  }
  getProfessorDetails(professorId: number): Observable<ProfessorDetailsTransport> {
    return this.httpClient.get<ProfessorDetailsTransport>(`${this.url}/${this.apiUrl}/${professorId}/details`);
  }

  getProfessorSubjects(professorId: number): Observable<SubjectListTransport> {
    return this.httpClient.get<SubjectListTransport>(`${this.url}/${this.apiUrl}/${professorId}/subjects`);
  }

  addSubjectToProfessor(professorId: number, subjectId: number): Observable<SubjectTransport> {
    return this.httpClient.post<SubjectTransport>(`${this.url}/${this.apiUrl}/${professorId}/subjects`, subjectId);
  }
}
