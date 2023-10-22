import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassroomListComponent } from './components/classroom-list/classroom-list.component';
import { ClassroomManagementComponent } from './pages/classroom-management/classroom-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ClassroomRoutingModule } from './classroom-routing.module';

@NgModule({
  declarations: [ClassroomListComponent, ClassroomManagementComponent],
  imports: [CommonModule, ReactiveFormsModule, ClassroomRoutingModule],
  exports: [ClassroomListComponent],
})
export class ClassroomModule {}
