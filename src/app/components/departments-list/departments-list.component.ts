import { Component, OnDestroy, OnInit } from '@angular/core';
import { DepartmentListTransport, DepartmentTransport } from '../../shared/models/department';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../core/http/department.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.css'],
})
export class DepartmentsListComponent implements OnInit, OnDestroy {
  departments$: BehaviorSubject<DepartmentTransport[]>;
  isEditMode: boolean = false;
  scheduleToBeEditedId: number = -1;
  departmentForm: FormGroup;
  showForm: boolean = false;
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
  ) {
    this.departmentForm = this.buildFormGroup(formBuilder);
    this.departments$ = new BehaviorSubject<DepartmentTransport[]>([]);
  }

  ngOnInit() {
    this.loadDepartments();
  }

  buildFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      name: new FormControl('', Validators.required),
    });
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (departmentListTransport: DepartmentListTransport) => {
        this.departments$.next(departmentListTransport.departmentTransportList);
      },
      error: (err) => console.error('Error loading departments', err),
    });
  }

  postDepartment() {
    if (this.departmentForm.valid) {
      const departmentTransport = this.departmentForm.value;
      this.departmentService
        .post(departmentTransport)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (createdDepartmentTransport: DepartmentTransport) => {
            const updatedDepartments: DepartmentTransport[] = [...this.departments$.getValue(), createdDepartmentTransport];
            this.departments$.next(updatedDepartments);
            this.closeForm();
          },
          error: (err) => console.error('Error posting department:', err),
        });
    }
  }

  deleteDepartment(departmentId: number) {
    this.departmentService
      .delete(departmentId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          const currentDepartments: DepartmentTransport[] = this.departments$.getValue();
          const updatedDepartments: DepartmentTransport[] = currentDepartments.filter((department) => department.id !== departmentId);
          this.departments$.next(updatedDepartments);
        },
        error: (err) => console.error('Error deleting department:', err),
      });
  }

  updateDepartment(departmentId: number) {
    if (this.departmentForm.valid) {
      this.departmentService
        .update(departmentId, this.departmentForm.value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (updatedDepartment: DepartmentTransport) => {
            const currentDepartments: DepartmentTransport[] = this.departments$.getValue();
            const updatedDepartments: DepartmentTransport[] = currentDepartments.map((department) => {
              if (department.id === departmentId) {
                return updatedDepartment;
              }
              return department;
            });
            this.departments$.next(updatedDepartments);
            this.closeForm();
            this.isEditMode = false;
          },
          error: (err) => console.error('Error updating department:', err),
        });
    }
  }

  openEditForm(departmentId: number) {
    this.isEditMode = true;
    this.scheduleToBeEditedId = departmentId;
    this.openForm();
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.departmentForm.reset();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
