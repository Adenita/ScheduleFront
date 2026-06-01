import { GeneralModalData, ModalManagementService } from '../../../shared/services/modal-management.service';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { UserFormModalComponent } from '../components/user-form-modal/user-form-modal.component';
import { Role, UserTransport } from '../../../../../shared/models/user';

export interface UserModalData extends GeneralModalData {
    roles: Role[];
}
@Injectable({
    providedIn: 'root',
})
export class UserModalManagementService extends ModalManagementService<UserFormModalComponent, UserModalData> {
    bindUserModalData(
        selectedUserId: number,
        userForm: FormGroup,
        isEditMode: boolean,
        users$: BehaviorSubject<UserTransport[]>,
        roles: Role[],
    ): UserModalData {
        return {
            selectedId: selectedUserId,
            form: userForm,
            data$: users$,
            isEditMode: isEditMode,
            roles,
        };
    }
}
