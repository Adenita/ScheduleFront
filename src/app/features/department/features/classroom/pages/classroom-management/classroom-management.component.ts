import { Component, OnDestroy, OnInit } from '@angular/core';
import { Classroom } from '../../../../../../shared/models/classroom';
import { ClassroomService } from '../../../../../../core/services/http/classroom.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ClassroomModalData, ClassroomModalManagementService } from '../../services/classroom-modal-management.service';
import { ClassroomFormModalComponent } from '../../components/classroom-form-modal/classroom-form-modal.component';
import { PermissionService } from '../../../../../../auth/services/permission.service';
import { Role } from '../../../../../../shared/models/user';

@Component({
  selector: 'app-classroom-management',
  templateUrl: './classroom-management.component.html',
  styleUrls: ['./classroom-management.component.css'],
})
export class ClassroomManagementComponent implements OnInit, OnDestroy {
  classrooms$: BehaviorSubject<Classroom[]>;
  classroomForm: FormGroup;
  isEditMode: boolean = false;
  classroomToBeEditedId: number = -1;
  classroomModalData: ClassroomModalData = {} as ClassroomModalData;
  destroyed$: Subject<void> = new Subject<void>();
  isAdmin: boolean = false;

  constructor(
    private classroomService: ClassroomService,
    private formBuilder: FormBuilder,
    private classroomModalManagementService: ClassroomModalManagementService,
    private permissionService: PermissionService,
  ) {
    this.classrooms$ = new BehaviorSubject<Classroom[]>([]);
    this.classroomForm = this.buildFormGroup(formBuilder);
  }

  ngOnInit() {
    this.bindClassroomModalData();
    this.getClassrooms();
    this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
  }

  buildFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      name: new FormControl('', Validators.required),
      numberOfSeats: new FormControl(Validators.required, Validators.min(10)),
      hasComputers: new FormControl(false, Validators.required),
    });
  }

  getClassrooms(): void {
    this.classroomService.getAll().subscribe({
      next: (classroomTransport) => this.classrooms$.next(classroomTransport.classrooms),
      error: (err) => console.error('Error fetching classrooms', err),
    });
  }

  postClassroom() {
    if (this.classroomForm.valid) {
      const classroom = this.classroomForm.value;
      this.classroomService.post(classroom).subscribe({
        next: (postedClassroom: Classroom) => {
          this.classrooms$.next([...this.classrooms$.getValue(), postedClassroom]);
        },
        error: (err) => console.error('Error posting classroom:', err),
      });
    }
  }

  deleteClassroom(classroomId: number) {
    this.classroomService
      .delete(classroomId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          const currentClassrooms: Classroom[] = this.classrooms$.getValue();
          const updatedClassrooms: Classroom[] = currentClassrooms.filter((classroom) => classroom.id !== classroomId);
          this.classrooms$.next(updatedClassrooms);
        },
        error: (err) => console.error('Error deleting classroom:', err),
      });
  }

  updateClassroom(classroomId: number) {
    if (this.classroomForm.valid) {
      this.classroomService
        .update(classroomId, this.classroomForm.value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (updatedClassroom: Classroom) => {
            const currentClassrooms: Classroom[] = this.classrooms$.getValue();
            const updatedClassrooms: Classroom[] = currentClassrooms.map((classroom) => {
              if (classroom.id === classroomId) {
                return updatedClassroom;
              }
              return classroom;
            });
            this.classrooms$.next(updatedClassrooms);
          },
          error: (err) => console.error('Error updating classroom:', err),
        });
    }
  }

  openClassroomFormModalInEditMode(id: number) {
    this.classroomModalManagementService.update = this.updateClassroom.bind(this);
    this.classroomModalManagementService.openFormModalInEditMode(ClassroomFormModalComponent, id, this.classroomModalData);
  }

  openClassroomFormModal() {
    this.classroomModalManagementService.post = this.postClassroom.bind(this);
    this.classroomModalManagementService.openFormModal(ClassroomFormModalComponent, this.classroomModalData);
  }

  bindClassroomModalData() {
    this.classroomModalData = this.classroomModalManagementService.bindClassroomModalData(
      this.classroomToBeEditedId,
      this.classroomForm,
      this.isEditMode,
      this.classrooms$,
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
