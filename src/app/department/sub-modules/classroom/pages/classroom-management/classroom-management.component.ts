import { Component, OnInit } from '@angular/core';
import { Classroom } from '../../../../../shared/models/classroom';
import { ClassroomService } from '../../../../../core/http/classroom.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-classroom-management',
  templateUrl: './classroom-management.component.html',
  styleUrls: ['./classroom-management.component.css'],
})
export class ClassroomManagementComponent implements OnInit {
  classrooms$: BehaviorSubject<Classroom[]>;
  classroomForm: FormGroup;
  showForm = false;

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

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }
}
