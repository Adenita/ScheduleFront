import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { SubjectListTransport, SubjectTransport } from '../../shared/models/subject';
import { Observable } from 'rxjs';
import { StudentGroupsTransport } from '../../shared/models/student-groups';
import { ProfessorTransport } from '../../shared/models/professor';

@Injectable({
  providedIn: 'root',
})
export class SubjectService extends DataService<SubjectTransport, SubjectListTransport> {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.apiUrl = 'subjects';
  }

  getStudentGroupsPerSubject(subjectId: number): Observable<StudentGroupsTransport> {
    return this.httpClient.get<StudentGroupsTransport>(`${this.url}/${this.apiUrl}/${subjectId}/student_groups`);
  }

  getLecturersPerSubject(subjectId: number): Observable<ProfessorTransport> {
    return this.httpClient.get<ProfessorTransport>(`${this.url}/${this.apiUrl}/${subjectId}/lecturers`);
  }

  getProfessorsPerSubject(subjectId: number): Observable<ProfessorTransport> {
    return this.httpClient.get<ProfessorTransport>(`${this.url}/${this.apiUrl}/${subjectId}/professors`);
  }

  getAssistantsPerSubject(subjectId: number): Observable<ProfessorTransport> {
    return this.httpClient.get<ProfessorTransport>(`${this.url}/${this.apiUrl}/${subjectId}/assistants`);
  }
}
