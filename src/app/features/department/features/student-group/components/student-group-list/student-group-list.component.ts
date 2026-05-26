import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StudentGroupTransport } from '../../../../../../shared/models/student-group';

@Component({
  selector: 'app-student-group-list',
  standalone: false,
  templateUrl: './student-group-list.component.html',
  styleUrls: ['./student-group-list.component.css'],
})
export class StudentGroupListComponent {
  @Input()
  studentGroups$!: BehaviorSubject<StudentGroupTransport[]>;

  @Input()
  isAdmin!: boolean;

  @Input()
  route!: string;

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
