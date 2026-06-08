import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEventsService } from '../../../../shared/services/modal-events.service';
import { PreferredDayModalData } from '../../services/preferred-day-modal-management.service';

@Component({
    selector: 'app-professor-preferred-days-from-modal',
    standalone: false,
    templateUrl: './professor-preferred-days-from-modal.component.html',
})
export class ProfessorPreferredDaysFromModalComponent {
    @Input()
    modalData!: PreferredDayModalData;

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
