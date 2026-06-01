import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ModalEventsService {
    private _updateEvent: Subject<number> = new Subject<number>();
    private _postEvent: Subject<void> = new Subject<void>();
    private _closeEvent: Subject<void> = new Subject<void>();
    private _selectEvent: Subject<number> = new Subject<number>();

    emitUpdateEvent(id: number) {
        this._updateEvent.next(id);
    }

    emitPostEvent() {
        this._postEvent.next();
    }

    emitCloseEvent() {
        this._closeEvent.next();
    }

    emitSelectEvent(id: number) {
        this._selectEvent.next(id);
    }

    get updateEvent(): Subject<number> {
        return this._updateEvent;
    }
    get postEvent(): Subject<void> {
        return this._postEvent;
    }
    get closeEvent(): Subject<void> {
        return this._closeEvent;
    }
    get selectEvent(): Subject<number> {
        return this._selectEvent;
    }
}
