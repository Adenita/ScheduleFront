import { Injectable, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SubjectFormModalComponent } from '../components/subject-form-modal/subject-form-modal.component';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { LabRequirement, SubjectDetailsTransport, SubjectTransport } from '../../../../../shared/models/subject';
import { ModalEventsService } from '../../../shared/services/modal-events.service';

export type SubjectModalData = {
  selectedSubjectId: number;
  showForm: boolean;
  subjectForm: FormGroup;
  isEditMode: boolean;
  labRequirements: LabRequirement[];
  subjects$: BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>;
  departmentSubjects$: BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>;
  route: string;
};

@Injectable({
  providedIn: 'root',
})
export class SubjectModalManagementService implements OnDestroy {
  postSubject!: () => void;
  updateSubject!: (id: number) => void;
  private destroyed$: Subject<void> = new Subject();

  constructor(
    private modalService: NgbModal,
    private modalEventsService: ModalEventsService,
  ) {}
  openSubjectFormModal(subjectModalData: SubjectModalData) {
    const modalRef: NgbModalRef = this.modalService.open(SubjectFormModalComponent);
    this.updateModalComponentData(modalRef, subjectModalData);
    this.handlePostEvent(modalRef, subjectModalData, this.postSubject);
    this.handleUpdateEvent(modalRef, subjectModalData, this.updateSubject);
    this.handleCloseModalEvent(modalRef, subjectModalData);
    this.handleSelectEvent(modalRef, subjectModalData);
  }

  updateModalComponentData(modalRef: NgbModalRef, subjectModalData: SubjectModalData) {
    modalRef.componentInstance.subjectToBeEditedId = subjectModalData.selectedSubjectId;
    modalRef.componentInstance.subjectForm = subjectModalData.subjectForm;
    modalRef.componentInstance.isEditMode = subjectModalData.isEditMode;
    modalRef.componentInstance.showForm = subjectModalData.showForm;
    modalRef.componentInstance.labRequirements = subjectModalData.labRequirements;
    modalRef.componentInstance.route = subjectModalData.route;
    modalRef.componentInstance.subjects$ = subjectModalData.departmentSubjects$;
  }

  handleSelectEvent(modalRef: NgbModalRef, subjectModalData: SubjectModalData) {
    this.modalEventsService.selectEvent.pipe(takeUntil(this.destroyed$)).subscribe((id: number) => {
      subjectModalData.selectedSubjectId = id;
    });
  }

  handleCloseModalEvent(modalRef: NgbModalRef, subjectModalData: SubjectModalData) {
    this.modalEventsService.closeEvent.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.resetSubjectFormState(subjectModalData);
    });
  }

  handleUpdateEvent(modalRef: NgbModalRef, subjectModalData: SubjectModalData, updateSubject: (id: number) => void) {
    this.modalEventsService.updateEvent.pipe(takeUntil(this.destroyed$)).subscribe((id: number) => {
      updateSubject(id);
      this.resetSubjectFormState(subjectModalData);
      modalRef.close();
    });
  }

  handlePostEvent(modalRef: NgbModalRef, subjectModalData: SubjectModalData, postSubject: () => void) {
    this.modalEventsService.postEvent.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      postSubject();
      this.resetSubjectFormState(subjectModalData);
      modalRef.close();
    });
  }

  resetSubjectFormState(subjectModalData: SubjectModalData) {
    subjectModalData.isEditMode = false;
    subjectModalData.selectedSubjectId = -1;
    subjectModalData.subjectForm.reset();
  }

  openSubjectFormModalInEditMode(subjectId: number, subjectModalData: SubjectModalData) {
    subjectModalData.isEditMode = true;
    subjectModalData.selectedSubjectId = subjectId;
    this.fillSubjectFormWithSubjectToBeEdited(subjectId, subjectModalData);
    this.openSubjectFormModal(subjectModalData);
  }

  fillSubjectFormWithSubjectToBeEdited(id: number, subjectModalData: SubjectModalData) {
    const currentSubjects = subjectModalData.subjects$.getValue();
    const subject = currentSubjects.find((s) => s.id === id);
    if (subject) {
      subjectModalData.subjectForm.patchValue(subject);
    }
  }

  bindSubjectModalData(
    selectedSubjectId: number,
    showForm: boolean,
    subjectForm: FormGroup,
    isEditMode: boolean,
    labRequirements: LabRequirement[],
    subjects$: BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>,
    departmentSubjects$: BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>,
    route: string,
  ): SubjectModalData {
    return {
      selectedSubjectId,
      showForm,
      subjectForm,
      isEditMode,
      labRequirements,
      subjects$,
      departmentSubjects$,
      route,
    };
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
