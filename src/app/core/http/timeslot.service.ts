import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { Timeslot, TimeslotsTransport } from '../../shared/models/timeslots';

@Injectable({
  providedIn: 'root',
})
export class TimeslotService extends DataService<Timeslot, TimeslotsTransport> {
  constructor(httpClient: HttpClient) {
    super(httpClient);
    this.apiUrl = 'time_slots';
  }
}
