import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Classroom } from '../../../../../../shared/models/classroom';

@Component({
  selector: 'app-classroom-list',
  standalone: false,
  templateUrl: './classroom-list.component.html',
})
export class ClassroomListComponent {
  @Input()
  classrooms$!: BehaviorSubject<Classroom[]>;

  @Input()
  isAdmin!: boolean;

  @Output()
  editEvent: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  deleteEvent: EventEmitter<number> = new EventEmitter<number>();
  dateFormat: string = 'MMM d yyyy HH:mm';

  onEditClick(id: number) {
    this.editEvent.emit(id);
  }

  onDeleteClick(id: number) {
    this.deleteEvent.emit(id);
  }
}
