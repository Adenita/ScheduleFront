import { GeneralModalData, ModalManagementService } from '../../../shared/services/modal-management.service';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ProgramFormModalComponent } from '../components/program-form-modal/program-form-modal.component';
import { ProgramTransport } from '../../../../../shared/models/program';

export interface ProgramModalData extends GeneralModalData {}
@Injectable({
  providedIn: 'root',
})
export class ProgramModalManagementService extends ModalManagementService<ProgramFormModalComponent, ProgramModalData> {
  bindProgramModalData(
    selectedProgramId: number,
    programForm: FormGroup,
    isEditMode: boolean,
    programs$: BehaviorSubject<ProgramTransport[]>,
  ): ProgramModalData {
    return {
      selectedId: selectedProgramId,
      form: programForm,
      data$: programs$,
      isEditMode: isEditMode,
    };
  }
}
