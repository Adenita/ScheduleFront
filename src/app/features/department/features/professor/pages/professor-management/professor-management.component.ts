import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfessorListTransport, ProfessorTransport, Role } from '../../../../../../shared/models/professor';
import { ProfessorService } from '../../../../../../core/services/http/professor.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { ProfessorFormModalComponent } from '../../components/professor-form-modal/professor-form-modal.component';
import { ProfessorModalData, ProfessorModalManagementService } from '../../services/professor-modal-management.service';
import { DepartmentService } from '../../../../../../core/services/http/department.service';

@Component({
  selector: 'app-professors-management',
  templateUrl: './professor-management.component.html',
  styleUrls: ['./professor-management.component.css'],
})
export class ProfessorManagementComponent implements OnInit, OnDestroy {
  departmentId: number = -1;
  programId: number = -1;
  professors$: BehaviorSubject<ProfessorTransport[]>;
  professorRoles: Role[] = Object.values(Role);
  route: string = '';
  professorForm: FormGroup;
  isEditMode: boolean = false;
  professorToBeEditedId: number = -1;
  destroyed$: Subject<void> = new Subject<void>();
  professorModalData: ProfessorModalData = {} as ProfessorModalData;

  constructor(
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private departmentService: DepartmentService,
    private professorService: ProfessorService,
    private formBuilder: FormBuilder,
    private professorModalManagementService: ProfessorModalManagementService,
  ) {
    this.professorForm = this.buildFormGroup(formBuilder);
    this.professors$ = new BehaviorSubject<ProfessorTransport[]>([]);
  }

  ngOnInit() {
    this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.programId = this.routeParametersService.programId;
      this.route = this.routeParametersService.setRoute('professors');
      this.bindProfessorModalData();
      this.getDepartmentProfessors();
    });
  }

  buildFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      name: new FormControl('', Validators.required),
      role: new FormControl(Role.PROFESSOR),
    });
  }

  getProfessors(): void {
    this.professorService.getAll().subscribe({
      next: (professorListTransport: ProfessorListTransport) => this.professors$.next(professorListTransport.professorTransports),
      error: (err) => console.error('Error fetching professors', err),
    });
  }

  getDepartmentProfessors() {
    this.departmentService.getProfessorsPerDepartment(this.departmentId).subscribe({
      next: (professorListTransport: ProfessorListTransport) => this.professors$.next(professorListTransport.professorTransports),
      error: (err) => console.error('Error fetching department professors', err),
    });
  }

  postProfessor() {
    if (this.professorForm.valid) {
      const professor = this.professorForm.value;
      this.professorService.post(professor).subscribe({
        next: (postedProfessorTransport: ProfessorTransport) => {
          this.professors$.next([...this.professors$.getValue(), postedProfessorTransport]);
        },
        error: (err) => console.error('Error posting professor:', err),
      });
    }
  }

  deleteProfessor(professorId: number) {
    this.professorService
      .delete(professorId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          const currentProfessors: ProfessorTransport[] = this.professors$.getValue();
          const updatedProfessors: ProfessorTransport[] = currentProfessors.filter((professor) => professor.id !== professorId);
          this.professors$.next(updatedProfessors);
        },
        error: (err) => console.error('Error deleting professor:', err),
      });
  }

  updateProfessor(professorId: number) {
    if (this.professorForm.valid) {
      this.professorService
        .update(professorId, this.professorForm.value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (updatedProfessor: ProfessorTransport) => {
            const currentProfessors: ProfessorTransport[] = this.professors$.getValue();
            const updatedProfessors: ProfessorTransport[] = currentProfessors.map((professor) => {
              if (professor.id === professorId) {
                return updatedProfessor;
              }
              return professor;
            });
            this.professors$.next(updatedProfessors);
          },
          error: (err) => console.error('Error updating professor:', err),
        });
    }
  }

  openProfessorFormModalInEditMode(id: number) {
    this.professorModalManagementService.update = this.updateProfessor.bind(this);
    this.professorModalManagementService.openFormModalInEditMode(ProfessorFormModalComponent, id, this.professorModalData);
  }

  openProfessorFormModal() {
    this.professorModalManagementService.post = this.postProfessor.bind(this);
    this.professorModalManagementService.openFormModal(ProfessorFormModalComponent, this.professorModalData);
  }

  bindProfessorModalData() {
    this.professorModalData = this.professorModalManagementService.bindProfessorModalData(
      this.professorToBeEditedId,
      this.professorForm,
      this.isEditMode,
      this.professors$,
      this.professorRoles,
    );
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
