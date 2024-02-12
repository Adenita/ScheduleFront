import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentsListComponent } from './components/departments-list/departments-list.component';
import { DepartmentDetailsComponent } from './pages/department-details/department-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentRoutingModule } from './department-routing.module';
import { ProgramModule } from './features/program/program.module';
import { ProfessorModule } from './features/professor/professor.module';
import { SubjectModule } from './features/subject/subject.module';
import { StudentGroupModule } from './features/student-group/student-group.module';
import { ClassroomModule } from './features/classroom/classroom.module';
import { FeatureSharedModule } from '../shared/shared.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './features/user/user.module';
import { DepartmentFormModalComponent } from './components/department-form-modal/department-form-modal.component';

@NgModule({
  declarations: [DepartmentsListComponent, DepartmentDetailsComponent, DepartmentFormModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DepartmentRoutingModule,
    ProgramModule,
    ProfessorModule,
    SubjectModule,
    StudentGroupModule,
    ClassroomModule,
    SharedModule,
    FeatureSharedModule,
    UserModule,
  ],
  exports: [DepartmentsListComponent, DepartmentDetailsComponent],
})
export class DepartmentModule {}
