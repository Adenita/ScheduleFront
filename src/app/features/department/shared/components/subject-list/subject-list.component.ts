import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SubjectDetailsTransport, SubjectTransport } from '../../../../../shared/models/subject';

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

  @Input()
  manageList!: boolean;

  @Output()
  editEvent: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  selectEvent: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  deleteEvent: EventEmitter<number> = new EventEmitter<number>();
  dateFormat: string = 'MMM d yyyy HH:mm';

  onEditClick(event: any, id: number) {
    event.stopPropagation();
    this.editEvent.emit(id);
  }

  onDeleteClick(event: any, id: number) {
    event.stopPropagation();
    this.deleteEvent.emit(id);
  }

  onSelectClick(event: any, id: number) {
    event.stopPropagation();
    this.selectEvent.emit(id);
  }
}
