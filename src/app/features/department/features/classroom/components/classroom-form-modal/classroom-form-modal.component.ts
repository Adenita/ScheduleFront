import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEventsService } from '../../../../shared/services/modal-events.service';
import { ClassroomModalData } from '../../services/classroom-modal-management.service';

@Component({
  selector: 'app-classroom-form-modal',
  standalone: false,
  templateUrl: './classroom-form-modal.component.html',
  styleUrls: ['./classroom-form-modal.component.css'],
})
export class ClassroomFormModalComponent {
  @Input()
  modalData!: ClassroomModalData;

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
