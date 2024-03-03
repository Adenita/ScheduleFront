import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ProfessorListTransport, ProfessorTransport, Rank } from '../../../../../../shared/models/professor';
import { ProfessorService } from '../../../../../../core/services/http/professor.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { ProfessorFormModalComponent } from '../../components/professor-form-modal/professor-form-modal.component';
import { ProfessorModalData, ProfessorModalManagementService } from '../../services/professor-modal-management.service';
import { DepartmentService } from '../../../../../../core/services/http/department.service';
import { Role } from '../../../../../../shared/models/user';
import { PermissionService } from '../../../../../../auth/services/permission.service';

@Component({
  selector: 'app-professors-management',
  templateUrl: './professor-management.component.html',
  styleUrls: ['./professor-management.component.scss'],
})
export class ProfessorManagementComponent implements OnInit, OnDestroy {
  departmentId: number = -1;
  programId: number = -1;
  professorId$: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  route: string = '';

  professors$: BehaviorSubject<ProfessorTransport[]>;
  selectedProfessor$: BehaviorSubject<ProfessorTransport>;

  filteredProfessors$: BehaviorSubject<ProfessorTransport[]>;
  searchQuery: string = '';

  professorForm: FormGroup;
  professorToBeEditedId: number = -1;
  professorModalData: ProfessorModalData = {} as ProfessorModalData;
  professorRoles: Rank[] = Object.values(Rank);
  roles: Role[] = Object.values(Role);

  isEditMode: boolean = false;
  isAdmin: boolean = false;

  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private departmentService: DepartmentService,
    private professorService: ProfessorService,
    private professorModalManagementService: ProfessorModalManagementService,
    private permissionService: PermissionService,
    private cdr: ChangeDetectorRef,
  ) {
    this.professorForm = this.buildFormGroup(formBuilder);
    this.professors$ = new BehaviorSubject<ProfessorTransport[]>([]);
    this.selectedProfessor$ = new BehaviorSubject<ProfessorTransport>({} as ProfessorTransport);
    this.filteredProfessors$ = new BehaviorSubject<ProfessorTransport[]>([]);
  }

  //Todo
  //Add method to fetch program professors
  ngOnInit() {
    console.log('PROFESSOR MANAGEMENT');
    this.routeParametersService.getNavigationEndParams(this.router, this.activatedRoute, this.destroyed$).then(() => {
      this.route = this.routeParametersService.currentRoute;
      this.departmentId = this.routeParametersService.departmentId;
      this.programId = this.routeParametersService.programId;
      this.routeParametersService.currentRoute$.subscribe((route) => {
        this.professorId$.next(this.routeParametersService.professorId);
        this.cdr.detectChanges();
      });
      this.bindProfessorModalData();
      this.getDepartmentProfessors();
    });
    this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
  }

  showProfessorDetails(): boolean {
    return this.programId == -1 && this.professorId$.getValue() != -1;
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value;
    this.filteredProfessors$.next(
      this.professors$.getValue().filter((professor) => professor.name.toLowerCase().includes(this.searchQuery.toLowerCase())),
    );
  }

  selectProfessor(professor: ProfessorTransport) {
    const url = this.routeParametersService.currentRoute;
    const newUrl = this.replaceProfessorIdInUrl(url, professor.id);
    this.selectedProfessor$.next(professor);
    this.router.navigate([newUrl]);
  }

  private replaceProfessorIdInUrl(url: string, newProfessorId: number): string {
    const parts = url.split('/');

    const professorIndex = parts.indexOf('professors');

    if (professorIndex === -1) {
      return url;
    }

    const professorIdIndex = professorIndex + 1;
    if (professorIdIndex < parts.length) {
      const currentProgramId = parseInt(parts[professorIdIndex], 10);

      if (!isNaN(currentProgramId)) {
        parts[professorIdIndex] = String(newProfessorId);
      }
    }

    return parts.join('/');
  }

  buildFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      name: new FormControl('', Validators.required),
      role: new FormControl(Rank.PROFESSOR),
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
      next: (professorListTransport: ProfessorListTransport) => {
        this.professors$.next(professorListTransport.professorTransports);
        this.filteredProfessors$.next(professorListTransport.professorTransports);
      },
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

  postProfessorToDepartment() {
    if (this.professorForm.valid) {
      this.departmentService.postProfessorToDepartment(this.departmentId, this.professorForm.value).subscribe({
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
    this.professorModalManagementService.post = this.postProfessorToDepartment.bind(this);
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
