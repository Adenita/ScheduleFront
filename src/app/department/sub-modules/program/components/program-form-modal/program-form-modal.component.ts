import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-program-form-modal',
  templateUrl: './program-form-modal.component.html',
  styleUrls: ['./program-form-modal.component.css'],
})
export class ProgramFormModalComponent {
  @Input()
  programForm!: FormGroup;

  @Input()
  isEditMode!: boolean;

  @Input()
  programToBeEditedId!: number;

  @Output()
  updateEvent: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  postEvent: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  closeForm: EventEmitter<void> = new EventEmitter<void>();

  constructor(public activeModal: NgbActiveModal) {}
  closeModal() {
    this.closeForm.emit();
    this.activeModal.close();
  }

  onUpdateClick(programId: number) {
    this.updateEvent.emit(programId);
  }

  onPostClick() {
    this.postEvent.emit();
  }
}
