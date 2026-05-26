import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramService } from '../../../../../../core/services/http/program.service';
import { GroupType, StudentGroupListTransport, StudentGroupTransport } from '../../../../../../shared/models/student-group';
import { StudentGroupsService } from '../../../../../../core/services/http/student-groups.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { StudentGroupModalData, StudentGroupModalManagementService } from '../../services/student-group-modal-management.service';
import { StudentGroupFormModalComponent } from '../../components/student-group-form-modal/student-group-form-modal.component';
import { PermissionService } from '../../../../../../auth/services/permission.service';
import { Role } from '../../../../../../shared/models/user';

@Component({
  selector: 'app-student-groups-list',
  standalone: false,
  templateUrl: './student-group-management.component.html',
  styleUrls: ['./student-group-management.component.css'],
})
export class StudentGroupManagementComponent implements OnInit, OnDestroy {
  programId: number = -1;
  groupTypes: GroupType[] = Object.values(GroupType);
  route: string = '';

  studentGroupForm: FormGroup;
  isEditMode: boolean = false;
  studentGroupToBeEditedId: number = -1;

  studentGroups$: BehaviorSubject<StudentGroupTransport[]>;
  destroyed$: Subject<void> = new Subject<void>();
  studentGroupModalData: StudentGroupModalData = {} as StudentGroupModalData;

  isAdmin: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private routeParametersService: RouteParametersService,
    private studentGroupService: StudentGroupsService,
    private programService: ProgramService,
    private formBuilder: FormBuilder,
    private studentGroupModalManagementService: StudentGroupModalManagementService,
    private permissionService: PermissionService,
  ) {
    this.studentGroupForm = this.buildFormGroup(formBuilder);
    this.studentGroups$ = new BehaviorSubject<StudentGroupTransport[]>([]);
  }

  ngOnInit() {
    this.routeParametersService.getRouteParams(this.activatedRoute).then(() => {
      this.programId = this.routeParametersService.programId;
      this.route = this.routeParametersService.setRoute('student_groups');
      this.bindStudentGroupModalData();
      this.getStudentGroupsByContext();
    });
    this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
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
          },
          error: (err) => console.error('Error posting studentGroup:', err),
        });
    }
  }

  deleteStudentGroup(studentGroupId: number) {
    this.studentGroupService
      .delete(studentGroupId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          const currentStudentGroups: StudentGroupTransport[] = this.studentGroups$.getValue();
          const updatedStudentGroups: StudentGroupTransport[] = currentStudentGroups.filter(
            (studentGroup) => studentGroup.id !== studentGroupId,
          );
          this.studentGroups$.next(updatedStudentGroups);
        },
        error: (err) => console.error('Error deleting studentGroup:', err),
      });
  }

  updateStudentGroup(studentGroupId: number) {
    if (this.studentGroupForm.valid) {
      this.studentGroupService
        .update(studentGroupId, this.studentGroupForm.value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (updatedStudentGroup: StudentGroupTransport) => {
            const currentStudentGroups: StudentGroupTransport[] = this.studentGroups$.getValue();
            const updatedStudentGroups: StudentGroupTransport[] = currentStudentGroups.map((studentGroup) => {
              if (studentGroup.id === studentGroupId) {
                return updatedStudentGroup;
              }
              return studentGroup;
            });
            this.studentGroups$.next(updatedStudentGroups);
          },
          error: (err) => console.error('Error updating studentGroup:', err),
        });
    }
  }

  openStudentGroupFormModalInEditMode(id: number) {
    this.studentGroupModalManagementService.update = this.updateStudentGroup.bind(this);
    this.studentGroupModalManagementService.openFormModalInEditMode(
      StudentGroupFormModalComponent,
      id,
      this.studentGroupModalData,
    );
  }

  openStudentGroupFormModal() {
    this.studentGroupModalManagementService.post = this.postStudentGroup.bind(this);
    this.studentGroupModalManagementService.openFormModal(StudentGroupFormModalComponent, this.studentGroupModalData);
  }

  bindStudentGroupModalData() {
    this.studentGroupModalData = this.studentGroupModalManagementService.bindStudentGroupModalData(
      this.studentGroupToBeEditedId,
      this.studentGroupForm,
      this.isEditMode,
      this.studentGroups$,
      this.groupTypes,
    );
  }
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
