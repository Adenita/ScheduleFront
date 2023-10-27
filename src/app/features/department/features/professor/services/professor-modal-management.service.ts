import { GeneralModalData, ModalManagementService } from '../../../shared/services/modal-management.service';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ProfessorFormModalComponent } from '../components/professor-form-modal/professor-form-modal.component';
import { ProfessorTransport, Role } from '../../../../../shared/models/professor';

export interface ProfessorModalData extends GeneralModalData {
  professorRoles: Role[];
}
@Injectable({
  providedIn: 'root',
})
export class ProfessorModalManagementService extends ModalManagementService<ProfessorFormModalComponent, ProfessorModalData> {
  bindProfessorModalData(
    selectedProfessorId: number,
    professorForm: FormGroup,
    isEditMode: boolean,
    professors$: BehaviorSubject<ProfessorTransport[]>,
    professorRoles: Role[],
  ): ProfessorModalData {
    return {
      selectedId: selectedProfessorId,
      form: professorForm,
      data$: professors$,
      isEditMode: isEditMode,
      professorRoles,
    };
  }
}
