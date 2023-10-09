import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { SubjectDetailsTransport, SubjectListTransport, SubjectTransport } from '../../shared/models/subject';
import { Observable } from 'rxjs';
import { StudentGroupListTransport } from '../../shared/models/student-group';
import { ProfessorTransport } from '../../shared/models/professor';

@Injectable({
  providedIn: 'root',
})
export class SubjectService extends DataService<SubjectTransport, SubjectListTransport> {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.apiUrl = 'subjects';
  }

  getSubjectDetails(subjectId: number): Observable<SubjectDetailsTransport> {
    return this.httpClient.get<SubjectDetailsTransport>(`${this.url}/${this.apiUrl}/${subjectId}/details`);
  }
  getStudentGroupsPerSubject(subjectId: number): Observable<StudentGroupListTransport> {
    return this.httpClient.get<StudentGroupListTransport>(`${this.url}/${this.apiUrl}/${subjectId}/student_groups`);
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
