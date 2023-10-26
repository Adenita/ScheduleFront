import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramService } from '../../../../../../core/services/http/program.service';
import { DepartmentService } from '../../../../../../core/services/http/department.service';
import { ActivatedRoute } from '@angular/router';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ProgramTransport, ProgramListTransport } from '../../../../../../shared/models/program';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProgramFormModalComponent } from '../../components/program-form-modal/program-form-modal.component';

@Component({
  selector: 'app-program-management',
  templateUrl: './program-management.component.html',
  styleUrls: ['./program-management.component.css'],
})
export class ProgramManagementComponent implements OnInit, OnDestroy {
  departmentId: number = -1;
  programs$: BehaviorSubject<ProgramTransport[]>;
  route: string = '';
  programForm: FormGroup;
  isEditMode: boolean = false;
  programToBeEditedId: number = -1;
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private programService: ProgramService,
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.programForm = this.buildFormGroup(formBuilder);
    this.programs$ = new BehaviorSubject<ProgramTransport[]>([]);
  }

  ngOnInit() {
    this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.route = this.routeParametersService.setRoute('programs');
      this.loadDepartmentPrograms(this.departmentId);
    });
  }

  buildFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      name: new FormControl('', Validators.required),
      departmentId: this.departmentId,
    });
  }

  loadDepartmentPrograms(departmentId: number): void {
    this.departmentService.getProgramsPerDepartment(departmentId).subscribe({
      next: (programsTransport: ProgramListTransport) => {
        this.programs$.next(programsTransport.programTransports);
      },
      error: (err) => console.error('Error loading department programs', err),
    });
  }

  postProgram() {
    if (this.programForm.valid) {
      const program = this.programForm.value;
      this.programService.post(program).subscribe({
        next: (postedProgramTransport: ProgramTransport) => {
          this.programs$.next([...this.programs$.getValue(), postedProgramTransport]);
        },
        error: (err) => console.error('Error posting program:', err),
      });
    }
  }

  deleteProgram(programId: number) {
    this.programService
      .delete(programId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          const currentPrograms: ProgramTransport[] = this.programs$.getValue();
          const updatedPrograms: ProgramTransport[] = currentPrograms.filter((program) => program.id !== programId);
          this.programs$.next(updatedPrograms);
        },
        error: (err) => console.error('Error deleting program:', err),
      });
  }

  updateProgram(programId: number) {
    if (this.programForm.valid) {
      this.programService
        .update(programId, this.programForm.value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (updatedProgram: ProgramTransport) => {
            const currentPrograms: ProgramTransport[] = this.programs$.getValue();
            const updatedPrograms: ProgramTransport[] = currentPrograms.map((program) => {
              if (program.id === programId) {
                return updatedProgram;
              }
              return program;
            });
            this.programs$.next(updatedPrograms);
          },
          error: (err) => console.error('Error updating program:', err),
        });
    }
  }

  openProgramFormModal() {
    const modalRef: NgbModalRef = this.modalService.open(ProgramFormModalComponent);
    this.updateModalComponentData(modalRef);
    this.handlePostEvent(modalRef);
    this.handleUpdateEvent(modalRef);
    this.handleCloseModalEvent(modalRef);
  }

  updateModalComponentData(modalRef: NgbModalRef) {
    modalRef.componentInstance.programToBeEditedId = this.programToBeEditedId;
    modalRef.componentInstance.programForm = this.programForm;
    modalRef.componentInstance.isEditMode = this.isEditMode;
  }

  handleCloseModalEvent(modalRef: NgbModalRef) {
    modalRef.componentInstance.closeForm.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.resetProgramFormState();
    });
  }

  handleUpdateEvent(modalRef: NgbModalRef) {
    modalRef.componentInstance.updateEvent.pipe(takeUntil(this.destroyed$)).subscribe((id: number) => {
      this.updateProgram(id);
      this.resetProgramFormState();
      modalRef.close();
    });
  }

  handlePostEvent(modalRef: NgbModalRef) {
    modalRef.componentInstance.postEvent.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.postProgram();
      this.resetProgramFormState();
      modalRef.close();
    });
  }

  resetProgramFormState() {
    this.isEditMode = false;
    this.programToBeEditedId = -1;
    this.programForm.reset();
  }

  openProgramFormModalInEditMode(programId: number) {
    this.isEditMode = true;
    this.programToBeEditedId = programId;
    this.fillProgramFormWithProgramToBeEdited(programId);
    this.openProgramFormModal();
  }

  fillProgramFormWithProgramToBeEdited(id: number) {
    const currentPrograms = this.programs$.getValue();
    const program = currentPrograms.find((p) => p.id === id);
    if (program) {
      this.programForm.patchValue(program);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
