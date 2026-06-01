import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEventsService } from '../../../../shared/services/modal-events.service';
import { StudentGroupModalData } from '../../services/student-group-modal-management.service';

@Component({
  selector: 'app-student-group-form-modal',
  standalone: false,
  templateUrl: './student-group-form-modal.component.html',
})
export class StudentGroupFormModalComponent {
  @Input()
  modalData!: StudentGroupModalData;

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
