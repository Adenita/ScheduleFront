import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentGroupListComponent } from './components/student-group-list/student-group-list.component';
import { StudentGroupManagementComponent } from './pages/student-group-management/student-group-management.component';

@NgModule({
  declarations: [StudentGroupListComponent, StudentGroupManagementComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [StudentGroupListComponent],
})
export class StudentGroupModule {}
