import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabRequirement } from '../../../../../shared/models/subject';

@Component({
  selector: 'app-subject-form-modal',
  templateUrl: './subject-form-modal.component.html',
  styleUrls: ['./subject-form-modal.component.css'],
})
export class SubjectFormModalComponent {
  @Input()
  subjectForm!: FormGroup;

  @Input()
  isEditMode!: boolean;

  @Input()
  subjectToBeEditedId!: number;

  @Input()
  labRequirements!: LabRequirement[];

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
