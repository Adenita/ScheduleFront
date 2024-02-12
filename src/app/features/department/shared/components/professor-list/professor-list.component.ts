import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProfessorTransport } from '../../../../../shared/models/professor';

@Component({
  selector: 'app-professor-list',
  templateUrl: './professor-list.component.html',
  styleUrls: ['./professor-list.component.css'],
})
export class ProfessorListComponent {
  @Input()
  professors$!: BehaviorSubject<ProfessorTransport[]>;

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
