import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEventsService } from '../../../../shared/services/modal-events.service';
import { SubjectModalData } from '../../services/subject-modal-management.service';

@Component({
  selector: 'app-subject-form-modal',
  templateUrl: './subject-form-modal.component.html',
  styleUrls: ['./subject-form-modal.component.css'],
})
export class SubjectFormModalComponent {
  @Input()
  subjectModalData!: SubjectModalData;

  constructor(
    public activeModal: NgbActiveModal,
    private modalEventsService: ModalEventsService,
  ) {}

  closeModal() {
    this.modalEventsService.emitCloseEvent();
    this.activeModal.close();
  }

  onUpdateClick(programId: number) {
    this.modalEventsService.emitUpdateEvent(programId);
  }

  onPostClick() {
    this.modalEventsService.emitPostEvent();
  }

  getSelectedSubject(subjectId: number) {
    this.modalEventsService.emitSelectEvent(subjectId);
  }
}
