import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Classroom, ClassroomTransport } from '../../../shared/models/classroom';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService extends DataService<Classroom, ClassroomTransport> {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.apiUrl = 'classrooms';
  }

  getLabClassrooms(): Observable<ClassroomTransport> {
    return this.httpClient.get<ClassroomTransport>(`${this.url}/${this.apiUrl}/lab`);
  }

  getLectureClassrooms(): Observable<ClassroomTransport> {
    return this.httpClient.get<ClassroomTransport>(`${this.url}/${this.apiUrl}/lecture`);
  }
}
