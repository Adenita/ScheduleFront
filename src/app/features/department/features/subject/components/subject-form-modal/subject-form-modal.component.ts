import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LabRequirement, SubjectDetailsTransport, SubjectTransport } from '../../../../../../shared/models/subject';
import { BehaviorSubject } from 'rxjs';
import { ModalEventsService } from '../../../../shared/services/modal-events.service';

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
