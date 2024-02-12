import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GeneralModalData, ModalManagementService } from '../../features/department/shared/services/modal-management.service';
import { LoginFormModalComponent } from '../components/login-form-modal/login-form-modal.component';

export interface LoginModalData extends GeneralModalData {}
@Injectable({
  providedIn: 'root',
})
export class LoginModalManagementService extends ModalManagementService<LoginFormModalComponent, LoginModalData> {
  bindLoginModalData(userForm: FormGroup): LoginModalData {
    return {
      form: userForm,
    } as LoginModalData;
  }
}
