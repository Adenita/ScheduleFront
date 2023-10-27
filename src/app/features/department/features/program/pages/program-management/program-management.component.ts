import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramService } from '../../../../../../core/services/http/program.service';
import { DepartmentService } from '../../../../../../core/services/http/department.service';
import { ActivatedRoute } from '@angular/router';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ProgramTransport, ProgramListTransport } from '../../../../../../shared/models/program';
import { ProgramModalData, ProgramModalManagementService } from '../../services/program-modal-management.service';
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
  programModalData: ProgramModalData = {} as ProgramModalData;

  constructor(
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private programService: ProgramService,
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private programModalManagementService: ProgramModalManagementService,
  ) {
    this.programForm = this.buildFormGroup(formBuilder);
    this.programs$ = new BehaviorSubject<ProgramTransport[]>([]);
  }

  ngOnInit() {
    this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.route = this.routeParametersService.setRoute('programs');
      this.bindProgramModalData();
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

  postProgramToDepartment() {
    if (this.programForm.valid) {
      this.departmentService.postProgramToDepartment(this.departmentId, this.programForm.value).subscribe({
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

  openProgramFormModalInEditMode(id: number) {
    this.programModalManagementService.update = this.updateProgram.bind(this);
    this.programModalManagementService.openFormModalInEditMode(ProgramFormModalComponent, id, this.programModalData);
  }

  openProgramFormModal() {
    this.programModalManagementService.post = this.postProgramToDepartment.bind(this);
    this.programModalManagementService.openFormModal(ProgramFormModalComponent, this.programModalData);
  }

  bindProgramModalData() {
    this.programModalData = this.programModalManagementService.bindProgramModalData(
      this.programToBeEditedId,
      this.programForm,
      this.isEditMode,
      this.programs$,
    );
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
