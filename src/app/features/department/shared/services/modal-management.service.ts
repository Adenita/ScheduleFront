import { Injectable, OnDestroy, Type } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ModalEventsService } from './modal-events.service';
import { FormGroup } from '@angular/forms';

export interface GeneralModalData {
  selectedId: number;
  form: FormGroup;
  data$: BehaviorSubject<any>;
  isEditMode: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class ModalManagementService<T, K extends GeneralModalData> implements OnDestroy {
  private destroyed$: Subject<void> = new Subject();
  post!: () => void;
  update!: (id: number) => void;

  constructor(
    private modalService: NgbModal,
    private modalEventsService: ModalEventsService,
  ) {}

  openFormModalInEditMode(modalComponent: Type<T>, subjectId: number, modalData: K) {
    modalData.isEditMode = true;
    modalData.selectedId = subjectId;
    this.fillFormWithSelectedData(subjectId, modalData);
    this.openFormModal(modalComponent, modalData);
  }

  fillFormWithSelectedData(id: number, modalData: K) {
    const currentData = modalData.data$.getValue();
    const selectedData = currentData.find((s: any) => s.id === id);
    if (selectedData) {
      modalData.form.patchValue(selectedData);
    }
  }
  openFormModal(modalComponent: Type<T>, modalData: K) {
    const modalRef: NgbModalRef = this.modalService.open(modalComponent);
    this.updateModalComponentData(modalRef, modalData);
    console.log('updated modal ref component with modal data: ', modalRef.componentInstance.modalData);
    this.handlePostEvent(modalRef, modalData, this.post);
    this.handleUpdateEvent(modalRef, modalData, this.update);
    this.handleCloseModalEvent(modalRef, modalData);
    this.handleSelectEvent(modalRef, modalData);
  }

  updateModalComponentData(modalRef: NgbModalRef, modalData: K) {
    modalRef.componentInstance.modalData = modalData;
  }

  handleSelectEvent(modalRef: NgbModalRef, modalData: K) {
    this.modalEventsService.selectEvent.pipe(takeUntil(this.destroyed$)).subscribe((id: number) => {
      modalData.selectedId = id;
    });
  }

  handleCloseModalEvent(modalRef: NgbModalRef, modalData: K) {
    this.modalEventsService.closeEvent.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.resetSubjectFormState(modalData);
    });
  }

  handleUpdateEvent(modalRef: NgbModalRef, modalData: K, update: (id: number) => void) {
    this.modalEventsService.updateEvent.pipe(takeUntil(this.destroyed$)).subscribe((id: number) => {
      update(id);
      this.resetSubjectFormState(modalData);
      modalRef.close();
    });
  }

  handlePostEvent(modalRef: NgbModalRef, modalData: K, post: () => void) {
    this.modalEventsService.postEvent.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      post();
      this.resetSubjectFormState(modalData);
      modalRef.close();
    });
  }

  resetSubjectFormState(modalData: K) {
    modalData.isEditMode = false;
    modalData.selectedId = -1;
    modalData.form.reset();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
