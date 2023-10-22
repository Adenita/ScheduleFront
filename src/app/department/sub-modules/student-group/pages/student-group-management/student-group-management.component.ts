import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramService } from '../../../../../core/services/http/program.service';
import { GroupType, StudentGroupListTransport, StudentGroupTransport } from '../../../../../shared/models/student-group';
import { StudentGroupsService } from '../../../../../core/services/http/student-groups.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouteParametersService } from '../../../../../core/services/route-parameters.service';

@Component({
  selector: 'app-student-groups-list',
  templateUrl: './student-group-management.component.html',
  styleUrls: ['./student-group-management.component.css'],
})
export class StudentGroupManagementComponent implements OnInit, OnDestroy {
  programId: number = -1;
  groupTypes: GroupType[] = Object.values(GroupType);
  route: string = '';

  studentGroupForm: FormGroup;
  showForm = false;

  studentGroups$: BehaviorSubject<StudentGroupTransport[]>;
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private studentGroupService: StudentGroupsService,
    private programService: ProgramService,
    private formBuilder: FormBuilder,
  ) {
    this.studentGroupForm = this.buildFormGroup(formBuilder);
    this.studentGroups$ = new BehaviorSubject<StudentGroupTransport[]>([]);
  }

  ngOnInit() {
    this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
      this.programId = this.routeParametersService.programId;
      this.route = this.routeParametersService.setRoute('student_groups');
      this.getStudentGroupsByContext();
    });
  }

  buildFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      name: new FormControl('', Validators.required),
      numberOfStudents: new FormControl(),
      groupType: new FormControl(GroupType.LECTURE),
    });
  }

  getStudentGroupsByContext() {
    if (this.programId != -1) this.getProgramStudentGroups();
    else this.getStudentGroups();
  }

  postStudentGroupToContext() {
    if (this.programId != -1) this.postStudentGroupToProgram();
    else this.postStudentGroup();
  }

  getStudentGroups(): void {
    this.studentGroupService
      .getAll()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (studentGroupTransport) => {
          this.studentGroups$.next(studentGroupTransport.studentGroupTransportList);
        },
        error: (err) => console.error('Error fetching studentGroups', err),
      });
  }

  getProgramStudentGroups(): void {
    this.programService
      .getStudentGroupsPerProgram(this.programId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (studentGroupsTransport: StudentGroupListTransport) => {
          this.studentGroups$.next(studentGroupsTransport.studentGroupTransportList);
        },
        error: (err) => console.error('Error fetching subjects', err),
      });
  }

  postStudentGroup() {
    if (this.studentGroupForm.valid) {
      this.studentGroupService
        .post(this.studentGroupForm.value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (studentGroupTransport: StudentGroupTransport) => {
            this.studentGroups$.next([...this.studentGroups$.getValue(), studentGroupTransport]);
            this.closeForm();
          },
          error: (err) => console.error('Error posting studentGroup:', err),
        });
    }
  }

  postStudentGroupToProgram() {
    if (this.studentGroupForm.valid) {
      this.programService
        .postStudentGroupToProgram(this.programId, this.studentGroupForm.value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (studentGroupTransport: StudentGroupTransport) => {
            this.studentGroups$.next([...this.studentGroups$.getValue(), studentGroupTransport]);
            this.closeForm();
          },
          error: (err) => console.error('Error posting studentGroup:', err),
        });
    }
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
