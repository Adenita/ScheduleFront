import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserTransport } from '../../../../../../shared/models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent {
  @Input()
  users$!: BehaviorSubject<UserTransport[]>;

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
