import { DataService } from '../data.service';
import { ScheduleListTransport, ScheduleTransport } from '../../../shared/models/schedule';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScheduleDataService extends DataService<ScheduleTransport, ScheduleListTransport> {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
    this.apiUrl = 'schedules';
  }

  //cache schedule
}
