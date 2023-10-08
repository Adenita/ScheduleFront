import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { ProfessorListTransport, ProfessorTransport } from '../../shared/models/professor';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService extends DataService<ProfessorTransport, ProfessorListTransport> {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.apiUrl = 'professors';
  }
}
