import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Hours,
  LabRequirement,
  RequirementType,
  SubjectListTransport,
  SubjectTransport,
} from '../../../../../../shared/models/subject';
import { FormGroup } from '@angular/forms';
import { SubjectService } from '../../../../../../core/services/http/subjects.service';
import { ProgramService } from '../../../../../../core/services/http/program.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { ActivatedRoute } from '@angular/router';
import { ProfessorService } from '../../../../../../core/services/http/professor.service';
import { SubjectFormBuilderService } from '../../services/subject-form-builder.service';
import { SubjectModalData, SubjectModalManagementService } from '../../services/subject-modal-management.service';
import { SubjectFormModalComponent } from '../../components/subject-form-modal/subject-form-modal.component';
import { DepartmentService } from '../../../../../../core/services/http/department.service';

@Component({
  selector: 'app-subject-management',
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.css'],
})
export class SubjectManagementComponent implements OnInit, OnDestroy {
  departmentId: number = -1;
  programId: number = -1;
  professorId: number = -1;
  route: string = '';

  labRequirements: LabRequirement[] = Object.values(LabRequirement);
  requirementTypes: RequirementType[] = Object.values(RequirementType);
  hours: Hours[] = Object.values(Hours);

  subjectForm: FormGroup;
  isEditMode: boolean = false;
  selectedSubjectId: number = -1;
  showForm: boolean = true;

  subjects$: BehaviorSubject<SubjectTransport[]>;
  departmentSubjects$: BehaviorSubject<SubjectTransport[]>;
  destroyed$: Subject<void> = new Subject<void>();

  subjectModalData: SubjectModalData = {} as SubjectModalData;

  constructor(
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private departmentService: DepartmentService,
    private subjectService: SubjectService,
    private programService: ProgramService,
    private professorService: ProfessorService,
    private subjectFormBuilderService: SubjectFormBuilderService,
    private subjectModalManagementService: SubjectModalManagementService,
  ) {
    this.subjectForm = this.subjectFormBuilderService.subjectForm;
    this.subjects$ = new BehaviorSubject<SubjectTransport[]>([]);
    this.departmentSubjects$ = new BehaviorSubject<SubjectTransport[]>([]);
  }

  ngOnInit() {
    this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
      this.departmentId = this.routeParametersService.departmentId;
      this.programId = this.routeParametersService.programId;
      this.professorId = this.routeParametersService.professorId;
      this.route = this.routeParametersService.setRoute('subjects');
      this.bindSubjectModalData();
      if (this.professorId != -1) {
        this.getDepartmentSubjects();
      }
      this.getSubjectByContext();
    });
  }
  getSubjectByContext() {
    if (this.programId != -1) this.getProgramSubjects();
    else if (this.professorId != -1) this.getProfessorSubjects();
    else this.getDepartmentSubjects();
  }

  postSubjectToContext() {
    if (this.programId != -1) this.postSubjectToProgram();
    else if (this.professorId != -1) this.postSubjectToProfessor();
    else this.postSubject();
  }

  removeSubjectByContext(subjectId: number) {
    if (this.professorId != -1) this.removeSubjectFromProfessor(subjectId);
    else this.deleteSubject(subjectId);
  }

  getSubjects(): void {
    this.subjectService
      .getAll()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (subjectTransport) => {
          if (this.professorId != -1) {
            this.departmentSubjects$.next(subjectTransport.subjects);
          } else {
            this.subjects$.next(subjectTransport.subjects);
          }
        },
        error: (err) => console.error('Error fetching subjects', err),
      });
  }

  getDepartmentSubjects(): void {
    this.departmentService
      .getSubjectsPerDepartment(this.departmentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (subjectTransport: SubjectListTransport) => {
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

  getProfessorSubjects(): void {
    this.professorService
      .getProfessorSubjects(this.professorId)
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

  postSubjectToProfessor() {
    this.professorService
      .addSubjectToProfessor(this.professorId, this.subjectModalData.selectedId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (subjectTransport: SubjectTransport) => {
          this.subjects$.next([...this.subjects$.getValue(), subjectTransport]);
        },
        error: (err) => console.error('Error posting subject:', err),
      });
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

  removeSubjectFromProfessor(subjectId: number) {
    this.professorService
      .removeSubjectFromProfessor(this.professorId, subjectId)
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
    this.showForm = this.professorId == -1;
    this.subjectModalData.showForm = this.showForm;
    this.subjectModalManagementService.post = this.postSubjectToContext.bind(this);
    this.subjectModalManagementService.openFormModal(SubjectFormModalComponent, this.subjectModalData);
  }

  openSubjectFormModalInEditMode(id: number) {
    this.subjectModalManagementService.update = this.updateSubject.bind(this);
    this.subjectModalManagementService.openFormModalInEditMode(SubjectFormModalComponent, id, this.subjectModalData);
  }

  bindSubjectModalData() {
    this.subjectModalData = this.subjectModalManagementService.bindSubjectModalData(
      this.selectedSubjectId,
      this.showForm,
      this.subjectForm,
      this.isEditMode,
      this.labRequirements,
      this.subjects$,
      this.departmentSubjects$,
      this.route,
      this.requirementTypes,
      this.hours,
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
