import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SubjectDetailsTransport, SubjectTransport } from '../../../../shared/models/subject';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css'],
})
export class SubjectListComponent {
  @Input()
  subjects$!: BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>;

  @Input()
  route!: string;

  @Output()
  editEvent: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  deleteEvent: EventEmitter<number> = new EventEmitter<number>();

  onEditClick(id: number) {
    this.editEvent.emit(id);
  }

  onDeleteClick(id: number) {
    this.deleteEvent.emit(id);
  }
}
