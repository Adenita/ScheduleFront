import { GeneralModalData, ModalManagementService } from '../../../shared/services/modal-management.service';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { StudentGroupFormModalComponent } from '../components/student-group-form-modal/student-group-form-modal.component';
import { GroupType, StudentGroupTransport } from '../../../../../shared/models/student-group';

export interface StudentGroupModalData extends GeneralModalData {
    groupTypes: GroupType[];
}
@Injectable({
    providedIn: 'root',
})
export class StudentGroupModalManagementService extends ModalManagementService<
    StudentGroupFormModalComponent,
    StudentGroupModalData
> {
    bindStudentGroupModalData(
        selectedStudentGroupId: number,
        classroomForm: FormGroup,
        isEditMode: boolean,
        studentGroups$: BehaviorSubject<StudentGroupTransport[]>,
        groupTypes: GroupType[],
    ): StudentGroupModalData {
        return {
            selectedId: selectedStudentGroupId,
            form: classroomForm,
            data$: studentGroups$,
            isEditMode: isEditMode,
            groupTypes,
        };
    }
}
