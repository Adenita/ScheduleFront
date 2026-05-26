import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassroomListComponent } from './components/classroom-list/classroom-list.component';
import { ClassroomManagementComponent } from './pages/classroom-management/classroom-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ClassroomRoutingModule } from './classroom-routing.module';
import { ClassroomFormModalComponent } from './components/classroom-form-modal/classroom-form-modal.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ClassroomListComponent, ClassroomManagementComponent, ClassroomFormModalComponent],
  imports: [CommonModule, ReactiveFormsModule, ClassroomRoutingModule, SharedModule],
  exports: [ClassroomListComponent],
})
export class ClassroomModule {}
