import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEventsService } from '../../shared/services/modal-events.service';
import { DepartmentModalData } from '../../services/department-modal-management.service';

@Component({
  selector: 'app-department-form-modal',
  templateUrl: './department-form-modal.component.html',
  styleUrls: ['./department-form-modal.component.css'],
})
export class DepartmentFormModalComponent {
  @Input()
  modalData!: DepartmentModalData;

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
