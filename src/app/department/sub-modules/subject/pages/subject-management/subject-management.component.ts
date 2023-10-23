import { Component, OnDestroy, OnInit } from '@angular/core';
import { LabRequirement, SubjectDetailsTransport, SubjectListTransport, SubjectTransport } from '../../../../../shared/models/subject';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from '../../../../../core/services/http/subjects.service';
import { ProgramService } from '../../../../../core/services/http/program.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { RouteParametersService } from '../../../../../core/services/route-parameters.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SubjectFormModalComponent } from '../../components/subject-form-modal/subject-form-modal.component';

@Component({
  selector: 'app-subject-management',
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.css'],
})
export class SubjectManagementComponent implements OnInit, OnDestroy {
  departmentId: number = -1;
  programId: number = -1;
  professorId: number = -1;
  labRequirements: LabRequirement[] = Object.values(LabRequirement);
  route: string = '';

  subjectForm: FormGroup;
  isEditMode: boolean = false;
  subjectToBeEditedId: number = -1;

  subjects$: BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>;
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private subjectService: SubjectService,
    private programService: ProgramService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.subjectForm = this.buildFormGroup(formBuilder);
    this.subjects$ = new BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>([]);
  }

  ngOnInit() {
    this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.programId = this.routeParametersService.programId;
      this.professorId = this.routeParametersService.professorId;
      this.route = this.routeParametersService.setRoute('subjects');
      this.getSubjectByContext();
    });
  }

  buildFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      name: new FormControl('', Validators.required),
      etcs: new FormControl(Validators.min(4)),
      requiresLab: new FormControl(LabRequirement.NO),
      semester: new FormControl(Validators.min(1)),
    });
  }

  getSubjectByContext() {
    if (this.programId != -1) this.getProgramSubjects();
    else this.getSubjects();
  }

  postSubjectToContext() {
    if (this.programId != -1) this.postSubjectToProgram();
    else this.postSubject();
  }

  getSubjects(): void {
    this.subjectService
      .getAll()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (subjectTransport) => {
          this.subjects$.next(subjectTransport.subjects);
        },
        error: (err) => console.error('Error fetching subjects', err),
      });
  }

  getProgramSubjects(): void {
    this.programService
      .getSubjectsPerProgram(this.programId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (subjectTransport: SubjectListTransport) => {
          this.subjects$.next(subjectTransport.subjects);
        },
        error: (err) => console.error('Error fetching subjects', err),
      });
  }

  postSubjectToProgram() {
    if (this.subjectForm.valid) {
      this.programService
        .postSubjectToProgram(this.programId, this.subjectForm.value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (subjectTransport: SubjectTransport) => {
            this.subjects$.next([...this.subjects$.getValue(), subjectTransport]);
          },
          error: (err) => console.error('Error posting subject:', err),
        });
    }
  }

  postSubject() {
    if (this.subjectForm.valid) {
      this.subjectService
        .post(this.subjectForm.value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (subjectTransport: SubjectTransport) => {
            this.subjects$.next([...this.subjects$.getValue(), subjectTransport]);
          },
          error: (err) => console.error('Error posting subject:', err),
        });
    }
  }

  deleteSubject(subjectId: number) {
    this.subjectService
      .delete(subjectId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          const currentSubjects: SubjectTransport[] = this.subjects$.getValue();
          const updatedSubjects: SubjectTransport[] = currentSubjects.filter((subject) => subject.id !== subjectId);
          this.subjects$.next(updatedSubjects);
        },
        error: (err) => console.error('Error deleting subject:', err),
      });
  }

  updateSubject(subjectId: number) {
    if (this.subjectForm.valid) {
      this.subjectService
        .update(subjectId, this.subjectForm.value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (updatedProgram: SubjectTransport) => {
            const currentSubjects: SubjectTransport[] = this.subjects$.getValue();
            const updatedSubjects: SubjectTransport[] = currentSubjects.map((subject) => {
              if (subject.id === subjectId) {
                return updatedProgram;
              }
              return subject;
            });
            this.subjects$.next(updatedSubjects);
          },
          error: (err) => console.error('Error updating subject:', err),
        });
    }
  }

  openSubjectFormModal() {
    const modalRef: NgbModalRef = this.modalService.open(SubjectFormModalComponent);
    this.updateModalComponentData(modalRef);
    this.handlePostEvent(modalRef);
    this.handleUpdateEvent(modalRef);
    this.handleCloseModalEvent(modalRef);
  }
  updateModalComponentData(modalRef: NgbModalRef) {
    modalRef.componentInstance.subjectToBeEditedId = this.subjectToBeEditedId;
    modalRef.componentInstance.subjectForm = this.subjectForm;
    modalRef.componentInstance.isEditMode = this.isEditMode;
    modalRef.componentInstance.labRequirements = this.labRequirements;
  }

  handleCloseModalEvent(modalRef: NgbModalRef) {
    modalRef.componentInstance.closeForm.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.resetSubjectFormState();
    });
  }

  handleUpdateEvent(modalRef: NgbModalRef) {
    modalRef.componentInstance.updateEvent.pipe(takeUntil(this.destroyed$)).subscribe((id: number) => {
      this.updateSubject(id);
      this.resetSubjectFormState();
      modalRef.close();
    });
  }

  handlePostEvent(modalRef: NgbModalRef) {
    modalRef.componentInstance.postEvent.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.postSubjectToContext();
      this.resetSubjectFormState();
      modalRef.close();
    });
  }

  resetSubjectFormState() {
    this.isEditMode = false;
    this.subjectToBeEditedId = -1;
    this.subjectForm.reset();
  }

  openSubjectFormModalInEditMode(subjectId: number) {
    this.isEditMode = true;
    this.subjectToBeEditedId = subjectId;
    this.fillSubjectFormWithSubjectToBeEdited(subjectId);
    this.openSubjectFormModal();
  }

  fillSubjectFormWithSubjectToBeEdited(id: number) {
    const currentSubjects = this.subjects$.getValue();
    const subject = currentSubjects.find((s) => s.id === id);
    if (subject) {
      this.subjectForm.patchValue(subject);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
