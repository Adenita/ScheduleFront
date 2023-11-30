import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ScheduleTransport } from '../../../schedule/shared/models/schedule';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.css'],
})
export class ScheduleListComponent {
  @Input()
  schedules$!: BehaviorSubject<ScheduleTransport[]>;

  @Output()
  editEvent: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  deleteEvent: EventEmitter<number> = new EventEmitter<number>();
  dateFormat: string = 'MMM d yyyy';

  onEditClick(id: number) {
    this.editEvent.emit(id);
  }

  onDeleteClick(id: number) {
    this.deleteEvent.emit(id);
  }
}
