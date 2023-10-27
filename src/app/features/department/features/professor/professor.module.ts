import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessorDetailsComponent } from './pages/professor-details/professor-details.component';
import { ProfessorManagementComponent } from './pages/professor-management/professor-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfessorRoutingModule } from './professor-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ProfessorFormModalComponent } from './components/professor-form-modal/professor-form-modal.component';

@NgModule({
  declarations: [ProfessorDetailsComponent, ProfessorManagementComponent, ProfessorFormModalComponent],
  imports: [CommonModule, ReactiveFormsModule, ProfessorRoutingModule, SharedModule],
  exports: [],
})
export class ProfessorModule {}
