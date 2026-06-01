import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProgramModalData } from '../../services/program-modal-management.service';
import { ModalEventsService } from '../../../../shared/services/modal-events.service';

@Component({
    selector: 'app-program-form-modal',
    standalone: false,
    templateUrl: './program-form-modal.component.html',
})
export class ProgramFormModalComponent {
    @Input()
    modalData!: ProgramModalData;

    constructor(
        public activeModal: NgbActiveModal,
        private modalEventsService: ModalEventsService,
    ) {}

    closeModal() {
        this.modalEventsService.emitCloseEvent();
        this.activeModal.close();
    }

    onUpdateClick(id: number) {
        this.modalEventsService.emitUpdateEvent(id);
    }

    onPostClick() {
        this.modalEventsService.emitPostEvent();
    }
}
