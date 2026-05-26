import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramService } from '../../../../../../core/services/http/program.service';
import { DepartmentService } from '../../../../../../core/services/http/department.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ProgramListTransport, ProgramTransport } from '../../../../../../shared/models/program';
import { ProgramModalData, ProgramModalManagementService } from '../../services/program-modal-management.service';
import { ProgramFormModalComponent } from '../../components/program-form-modal/program-form-modal.component';
import { PermissionService } from '../../../../../../auth/services/permission.service';
import { Role } from '../../../../../../shared/models/user';

@Component({
  selector: 'app-program-management',
  standalone: false,
  templateUrl: './program-management.component.html',
  styleUrls: ['./program-management.component.scss'],
})
export class ProgramManagementComponent implements OnInit, OnDestroy {
  departmentId: number = -1;
  programId$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  programs$: BehaviorSubject<ProgramTransport[]>;
  programForm: FormGroup;
  isEditMode: boolean = false;
  programToBeEditedId: number = -1;
  destroyed$: Subject<void> = new Subject<void>();
  programModalData: ProgramModalData = {} as ProgramModalData;
  isAdmin: boolean = false;
  route: string = '';

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private programService: ProgramService,
    private departmentService: DepartmentService,
    private programModalManagementService: ProgramModalManagementService,
    private permissionService: PermissionService,
    private cdr: ChangeDetectorRef,
  ) {
    this.programForm = this.buildFormGroup(formBuilder);
    this.programs$ = new BehaviorSubject<ProgramTransport[]>([]);
  }

  ngOnInit() {
    this.routeParametersService.getNavigationEvent(this.router, this.activatedRoute, this.destroyed$).subscribe({
      next: () => {
        this.initializeComponent(
          this.routeParametersService.departmentId,
          this.routeParametersService.currentRoute,
          this.routeParametersService.currentRoute$,
        );
      },
    });

    this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
  }

  initializeComponent(departmentId: number, currentRoute: string, currentRoute$: BehaviorSubject<string>) {
    this.route = currentRoute;
    this.departmentId = departmentId;
    this.routeParametersService.called = false;

    currentRoute$.subscribe((route) => {
      this.programId$.next(this.routeParametersService.programId);
      this.cdr.detectChanges();
    });

    this.bindProgramModalData();
    this.loadDepartmentPrograms(this.departmentId);
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

  selectProgram(program: ProgramTransport) {
    const url = this.routeParametersService.currentRoute;
    const newUrl = this.replaceProgramIdInUrl(url, program.id);
    this.programId$.next(program.id);
    this.router.navigate([newUrl]);
  }

  private replaceProgramIdInUrl(url: string, newProgramId: number): string {
    const parts = url.split('/');

    const programsIndex = parts.indexOf('programs');

    if (programsIndex === -1) {
      return url;
    }

    const programIdIndex = programsIndex + 1;
    if (programIdIndex < parts.length) {
      const currentProgramId = parseInt(parts[programIdIndex], 10);

      if (!isNaN(currentProgramId)) {
        parts[programIdIndex] = String(newProgramId);
      }
    }

    return parts.join('/');
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
