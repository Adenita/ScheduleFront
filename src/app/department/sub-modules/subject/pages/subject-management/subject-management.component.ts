import { Component, OnDestroy, OnInit } from '@angular/core';
import { LabRequirement, SubjectDetailsTransport, SubjectListTransport, SubjectTransport } from '../../../../../shared/models/subject';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from '../../../../../core/services/http/subjects.service';
import { ProgramService } from '../../../../../core/services/http/program.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { RouteParametersService } from '../../../../../core/services/route-parameters.service';
import { ActivatedRoute } from '@angular/router';

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
  showForm: boolean = false;

  subjects$: BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>;
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private subjectService: SubjectService,
    private programService: ProgramService,
    private formBuilder: FormBuilder,
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
      etcs: new FormControl(),
      requiresLab: new FormControl(LabRequirement.NO),
      semester: new FormControl(),
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
            this.closeForm();
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
            this.closeForm();
          },
          error: (err) => console.error('Error posting subject:', err),
        });
    }
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
