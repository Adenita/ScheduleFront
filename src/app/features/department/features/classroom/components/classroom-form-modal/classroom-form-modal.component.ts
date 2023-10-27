import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEventsService } from '../../../../shared/services/modal-events.service';
import { ClassroomModalData } from '../../services/classroom-modal-management.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-classroom-form-modal',
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

  onUpdateClick(programId: number) {
    this.modalEventsService.emitUpdateEvent(programId);
  }

  onPostClick() {
    this.modalEventsService.emitPostEvent();
  }
}
