import { GeneralModalData, ModalManagementService } from '../../../shared/services/modal-management.service';
import { ClassroomFormModalComponent } from '../components/classroom-form-modal/classroom-form-modal.component';
import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Classroom } from '../../../../../shared/models/classroom';

export interface ClassroomModalData extends GeneralModalData {}
@Injectable({
    providedIn: 'root',
})
export class ClassroomModalManagementService extends ModalManagementService<ClassroomFormModalComponent, ClassroomModalData> {
    bindClassroomModalData(
        selectedClassroomId: number,
        classroomForm: FormGroup,
        isEditMode: boolean,
        classrooms$: BehaviorSubject<Classroom[]>,
    ): ClassroomModalData {
        return {
            selectedId: selectedClassroomId,
            form: classroomForm,
            data$: classrooms$,
            isEditMode: isEditMode,
        };
    }
}
