import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEventsService } from '../../../../shared/services/modal-events.service';
import { SubjectModalData } from '../../services/subject-modal-management.service';

@Component({
  selector: 'app-subject-form-modal',
  standalone: false,
  templateUrl: './subject-form-modal.component.html',
  styleUrls: ['./subject-form-modal.component.css'],
})
export class SubjectFormModalComponent {
  @Input()
  modalData!: SubjectModalData;

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

  getSelectedSubject(id: number) {
    this.modalEventsService.emitSelectEvent(id);
  }
}
