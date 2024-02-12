import { Component, Input } from '@angular/core';
import { UserModalData } from '../../services/user-modal-management.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEventsService } from '../../../../shared/services/modal-events.service';

@Component({
  selector: 'app-user-form-modal',
  templateUrl: './user-form-modal.component.html',
  styleUrls: ['./user-form-modal.component.css'],
})
export class UserFormModalComponent {
  @Input()
  modalData!: UserModalData;

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
