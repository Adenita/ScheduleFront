import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProgramTransport, ProgramDetailsTransport } from '../../../../../../shared/models/program';

@Component({
    selector: 'app-program-list',
    standalone: false,
    templateUrl: './program-list.component.html',
})
export class ProgramListComponent {
    @Input()
    programs$!: BehaviorSubject<ProgramTransport[] | ProgramDetailsTransport[]>;

    @Input()
    isAdmin!: boolean;

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
