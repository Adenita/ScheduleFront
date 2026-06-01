import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventTransport } from '../../shared/models/event';
import { ScheduleTransport } from '../../shared/models/schedule';

@Component({
  selector: 'app-schedule',
  standalone: false,
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent {
  @Input()
  bestScheduleEvents$?: BehaviorSubject<EventTransport[]>;

  @Input()
  bestProgramSchedule?: ScheduleTransport;
}
