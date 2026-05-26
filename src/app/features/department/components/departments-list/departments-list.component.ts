import { Component, OnDestroy, OnInit } from '@angular/core';
import { DepartmentListTransport, DepartmentTransport } from '../../../../shared/models/department';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DepartmentService } from '../../../../core/services/http/department.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { PermissionService } from '../../../../auth/services/permission.service';
import { Role } from '../../../../shared/models/user';
import { DepartmentModalData, DepartmentModalManagementService } from '../../services/department-modal-management.service';
import { DepartmentFormModalComponent } from '../department-form-modal/department-form-modal.component';

@Component({
  selector: 'app-departments-list',
  standalone: false,
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.css'],
})
export class DepartmentsListComponent implements OnInit, OnDestroy {
  departments$: BehaviorSubject<DepartmentTransport[]>;
  isEditMode: boolean = false;
  departmentToBeEditedId: number = -1;
  departmentForm: FormGroup;
  showForm: boolean = false;
  destroyed$: Subject<void> = new Subject<void>();
  dateFormat: string = 'dd/MM/YYYY';
  isAdmin: boolean = false;
  departmentModalData: DepartmentModalData = {} as DepartmentModalData;

  constructor(
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder,
    private permissionService: PermissionService,
    private departmentModalManagementService: DepartmentModalManagementService,
  ) {
    this.departmentForm = this.buildFormGroup(formBuilder);
    this.departments$ = new BehaviorSubject<DepartmentTransport[]>([]);
  }

  ngOnInit() {
    this.loadDepartments();
    this.isAdmin = this.permissionService.hasRole(Role.ADMIN);
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
        this.bindDepartmentModalData();
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
          const updatedDepartments: DepartmentTransport[] = currentDepartments.filter(
            (department) => department.id !== departmentId,
          );
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
          },
          error: (err) => console.error('Error updating department:', err),
        });
    }
  }

  openDepartmentFormModalInEditMode(id: number) {
    this.departmentModalManagementService.update = this.updateDepartment.bind(this);
    this.departmentModalManagementService.openFormModalInEditMode(DepartmentFormModalComponent, id, this.departmentModalData);
  }

  openDepartmentFormModal() {
    this.departmentModalManagementService.post = this.postDepartment.bind(this);
    this.departmentModalManagementService.openFormModal(DepartmentFormModalComponent, this.departmentModalData);
  }

  bindDepartmentModalData() {
    this.departmentModalData = this.departmentModalManagementService.bindDepartmentModalData(
      this.departmentToBeEditedId,
      this.departmentForm,
      this.isEditMode,
      this.departments$,
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
