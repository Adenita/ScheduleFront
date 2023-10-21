import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentsListComponent } from './components/departments-list/departments-list.component';
import { DepartmentDetailsComponent } from './pages/department-details/department-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentRoutingModule } from './department-routing.module';
import { ProgramModule } from './sub-modules/program/program.module';

@NgModule({
  declarations: [DepartmentsListComponent, DepartmentDetailsComponent],
  imports: [CommonModule, ReactiveFormsModule, DepartmentRoutingModule, ProgramModule],
  exports: [DepartmentsListComponent, DepartmentDetailsComponent],
})
export class DepartmentModule {}
