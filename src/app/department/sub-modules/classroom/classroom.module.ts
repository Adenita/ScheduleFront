import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassroomListComponent } from './components/classroom-list/classroom-list.component';
import { ClassroomManagementComponent } from './pages/classroom-management/classroom-management.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ClassroomListComponent, ClassroomManagementComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [ClassroomListComponent],
})
export class ClassroomModule {}
