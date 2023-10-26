import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabRequirement, SubjectDetailsTransport, SubjectTransport } from '../../../../../shared/models/subject';
import { BehaviorSubject } from 'rxjs';

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
  showForm!: boolean;

  @Input()
  subjects$!: BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>;

  @Input()
  route!: string;

  @Input()
  labRequirements!: LabRequirement[];

  @Output()
  updateEvent: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  postEvent: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  closeForm: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  selectEvent: EventEmitter<number> = new EventEmitter<number>();

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

  getSelectedSubject(subjectId: number) {
    this.selectEvent.emit(subjectId);
  }
}
