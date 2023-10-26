import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProgramService } from '../../../../../../core/services/http/program.service';
import {
  GroupType,
  StudentGroupListTransport,
  StudentGroupTransport,
} from '../../../../../../shared/models/student-group';
import { StudentGroupsService } from '../../../../../../core/services/http/student-groups.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouteParametersService } from '../../../../../../core/services/route-parameters.service';
import { update } from 'lodash';

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
  showForm: boolean = false;
  isEditMode: boolean = false;
  studentGroupToBeEditedId: number = -1;

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
          console.log(studentGroupTransport.studentGroupTransportList);
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
            console.log('updated student group: ', updatedStudentGroup);
            const currentStudentGroups: StudentGroupTransport[] = this.studentGroups$.getValue();
            const updatedStudentGroups: StudentGroupTransport[] = currentStudentGroups.map((studentGroup) => {
              if (studentGroup.id === studentGroupId) {
                return updatedStudentGroup;
              }
              return studentGroup;
            });
            this.studentGroups$.next(updatedStudentGroups);
            this.closeForm();
            this.isEditMode = false;
          },
          error: (err) => console.error('Error updating studentGroup:', err),
        });
    }
  }

  // setSelectedStudentGroupDataToEditForm(studentGroupId: number) {
  //   console.log('selecting: ', studentGroupId);
  //   const currentStudentGroups: StudentGroupTransport[] = this.studentGroups$.getValue();
  //   console.log(currentStudentGroups[0], currentStudentGroups[3], currentStudentGroups[5], currentStudentGroups[6]);
  //   const studentGroupToEdit = currentStudentGroups.filter((sg) => (sg.id = studentGroupId));
  //   // console.log('current student groups; ', currentStudentGroups);
  //   // const studentGroupToEdit: StudentGroupTransport | undefined = currentStudentGroups.find(
  //   //   (studentGroup: StudentGroupTransport) => (studentGroup.id = studentGroupId),
  //   // );
  //   console.log(studentGroupToEdit[0]);
  //   this.studentGroupForm.patchValue(studentGroupToEdit[0]);
  //   // if (studentGroupToEdit) {
  //   //   console.log('student group chosen: ', studentGroupToEdit);
  //   //   const { id, name } = studentGroupToEdit;
  //   //   console.log(id, name);
  //   //   this.studentGroupForm.patchValue(studentGroupToEdit);
  //   // }
  // }

  openEditForm(studentGroupId: number) {
    this.isEditMode = true;
    this.studentGroupToBeEditedId = studentGroupId;
    // this.setSelectedStudentGroupDataToEditForm(studentGroupId);
    this.openForm();
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.studentGroupForm.patchValue({});
    this.showForm = false;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  protected readonly update = update;
}
