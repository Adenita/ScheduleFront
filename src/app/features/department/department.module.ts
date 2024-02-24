import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentsListComponent } from './components/departments-list/departments-list.component';
import { DepartmentDetailsComponent } from './pages/department-details/department-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentRoutingModule } from './department-routing.module';
import { FeatureSharedModule } from '../shared/shared.module';
import { SharedModule } from './shared/shared.module';
import { DepartmentFormModalComponent } from './components/department-form-modal/department-form-modal.component';

@NgModule({
  declarations: [DepartmentsListComponent, DepartmentDetailsComponent, DepartmentFormModalComponent],
  imports: [CommonModule, ReactiveFormsModule, DepartmentRoutingModule, SharedModule, FeatureSharedModule],
  exports: [DepartmentsListComponent, DepartmentDetailsComponent],
})
export class DepartmentModule {}
