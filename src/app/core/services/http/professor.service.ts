import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';
import { ProfessorDetailsTransport, ProfessorListTransport, ProfessorTransport } from '../../../shared/models/professor';
import { Observable } from 'rxjs';

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
}
