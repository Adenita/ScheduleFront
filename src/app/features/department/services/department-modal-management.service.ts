import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { DepartmentTransport } from '../../../shared/models/department';
import { DepartmentFormModalComponent } from '../components/department-form-modal/department-form-modal.component';
import { GeneralModalData, ModalManagementService } from '../shared/services/modal-management.service';

export interface DepartmentModalData extends GeneralModalData {}
@Injectable({
  providedIn: 'root',
})
export class DepartmentModalManagementService extends ModalManagementService<DepartmentFormModalComponent, DepartmentModalData> {
  bindDepartmentModalData(
    selectedDepartmentId: number,
    departmentForm: FormGroup,
    isEditMode: boolean,
    departments$: BehaviorSubject<DepartmentTransport[]>,
  ): DepartmentModalData {
    return {
      selectedId: selectedDepartmentId,
      form: departmentForm,
      data$: departments$,
      isEditMode: isEditMode,
    };
  }
}
