import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEventsService } from '../../../../shared/services/modal-events.service';
import { ProfessorModalData } from '../../services/professor-modal-management.service';

@Component({
  selector: 'app-professor-form-modal',
  templateUrl: './professor-form-modal.component.html',
  styleUrls: ['./professor-form-modal.component.css'],
})
export class ProfessorFormModalComponent {
  @Input()
  modalData!: ProfessorModalData;

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
