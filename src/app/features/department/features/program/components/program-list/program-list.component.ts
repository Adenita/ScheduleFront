import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProgramTransport, ProgramDetailsTransport } from '../../../../../../shared/models/program';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.css'],
})
export class ProgramListComponent {
  @Input()
  programs$!: BehaviorSubject<ProgramTransport[] | ProgramDetailsTransport[]>;

  @Input()
  route!: string;

  @Output()
  editEvent: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  deleteEvent: EventEmitter<number> = new EventEmitter<number>();

  dateFormat: string = 'MMM d yyyy HH:mm';

  onEditClick(programId: number) {
    this.editEvent.emit(programId);
  }

  onDeleteClick(programId: number) {
    this.deleteEvent.emit(programId);
  }
}
