import { Component, OnDestroy, OnInit } from '@angular/core';
import { Classroom } from '../../../../../shared/models/classroom';
import { ClassroomService } from '../../../../../core/services/http/classroom.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ClassroomTransport } from '../../../../../shared/models/classroom';

@Component({
  selector: 'app-classroom-management',
  templateUrl: './classroom-management.component.html',
  styleUrls: ['./classroom-management.component.css'],
})
export class ClassroomManagementComponent implements OnInit, OnDestroy {
  classrooms$: BehaviorSubject<Classroom[]>;
  classroomForm: FormGroup;
  showForm: boolean = false;
  isEditMode: boolean = false;
  classroomToBeEditedId: number = -1;
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private classroomService: ClassroomService,
    private formBuilder: FormBuilder,
  ) {
    this.classrooms$ = new BehaviorSubject<Classroom[]>([]);
    this.classroomForm = this.buildFormGroup(formBuilder);
  }

  ngOnInit() {
    this.getClassrooms();
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
          this.closeForm();
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
            this.closeForm();
            this.isEditMode = false;
          },
          error: (err) => console.error('Error updating classroom:', err),
        });
    }
  }

  openEditForm(classroomId: number) {
    this.isEditMode = true;
    this.classroomToBeEditedId = classroomId;
    this.openForm();
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
