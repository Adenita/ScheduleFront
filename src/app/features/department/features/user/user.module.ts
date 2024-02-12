import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserRoutingModule } from './user-routing.module';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { UserFormModalComponent } from './components/user-form-modal/user-form-modal.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [UserListComponent, UserManagementComponent, UserFormModalComponent, UserDetailsComponent],
  imports: [CommonModule, ReactiveFormsModule, UserRoutingModule, SharedModule],
  exports: [],
})
export class UserModule {}
