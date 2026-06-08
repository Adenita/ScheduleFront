import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentGroupListComponent } from './components/student-group-list/student-group-list.component';
import { StudentGroupManagementComponent } from './pages/student-group-management/student-group-management.component';
import { StudentGroupRoutingModule } from './student-group-routing.module';
import { StudentGroupFormModalComponent } from './components/student-group-form-modal/student-group-form-modal.component';

@NgModule({
    declarations: [StudentGroupListComponent, StudentGroupManagementComponent, StudentGroupFormModalComponent],
    imports: [CommonModule, ReactiveFormsModule, StudentGroupRoutingModule],
    exports: [StudentGroupListComponent],
})
export class StudentGroupModule {}
