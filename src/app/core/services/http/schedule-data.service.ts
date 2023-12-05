import { DataService } from '../data.service';
import { ScheduleListTransport, ScheduleTransport } from '../../../features/schedule/shared/models/schedule';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleDataService extends DataService<ScheduleTransport, ScheduleListTransport> {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.apiUrl = 'schedules';
  }

  addScheduleToDepartment(scheduleTransport: ScheduleTransport, departmentId: number): Observable<ScheduleTransport> {
    return this.httpClient.post<ScheduleTransport>(`${this.url}/departments/${departmentId}/${this.apiUrl}`, scheduleTransport);
  }

  getDepartmentSchedules(departmentId: number): Observable<ScheduleListTransport> {
    return this.httpClient.get<ScheduleListTransport>(`${this.url}/departments/${departmentId}/${this.apiUrl}`);
  }

  getScheduleForClassroom(scheduleId: number, classroomId: number): Observable<ScheduleTransport> {
    return this.httpClient.get<ScheduleTransport>(`${this.url}/${this.apiUrl}/${scheduleId}/classrooms/${classroomId}`);
  }

  getScheduleForProgram(scheduleId: number, programId: number): Observable<ScheduleTransport> {
    return this.httpClient.get<ScheduleTransport>(`${this.url}/${this.apiUrl}/${scheduleId}/programs/${programId}`);
  }

  //cache schedule
}
