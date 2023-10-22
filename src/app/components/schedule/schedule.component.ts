import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventTransport } from '../../shared/models/event';
import { ScheduleTransport } from '../../shared/models/schedule';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent {
  @Input()
  bestScheduleEvents$!: BehaviorSubject<EventTransport[]>;

  @Input()
  bestProgramSchedule!: ScheduleTransport;
}
