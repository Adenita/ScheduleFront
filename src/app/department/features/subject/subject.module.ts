import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SubjectManagementComponent } from './pages/subject-management/subject-management.component';
import { SubjectDetailsComponent } from './pages/subject-details/subject-details.component';
import { SubjectRoutingModule } from './subject-routing.module';
import { StudentGroupModule } from '../student-group/student-group.module';
import { SharedModule } from '../../shared/shared.module';
import { SubjectFormModalComponent } from './components/subject-form-modal/subject-form-modal.component';
import { SubjectModalManagementComponent } from './components/subject-modal-management/subject-modal-management.component';

@NgModule({
  declarations: [
    SubjectManagementComponent,
    SubjectDetailsComponent,
    SubjectFormModalComponent,
    SubjectModalManagementComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, SubjectRoutingModule, StudentGroupModule, SharedModule],
  exports: [],
})
export class SubjectModule {}
