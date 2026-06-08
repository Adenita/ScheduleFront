import { GeneralModalData, ModalManagementService } from '../../../shared/services/modal-management.service';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ProfessorFormModalComponent } from '../components/professor-form-modal/professor-form-modal.component';
import { ProfessorTransport, Rank } from '../../../../../shared/models/professor';

export interface ProfessorModalData extends GeneralModalData {
    ranks: Rank[];
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
        ranks: Rank[],
    ): ProfessorModalData {
        return {
            selectedId: selectedProfessorId,
            form: professorForm,
            data$: professors$,
            isEditMode: isEditMode,
            ranks,
        };
    }
}
