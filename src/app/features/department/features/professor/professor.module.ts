import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessorDetailsComponent } from './pages/professor-details/professor-details.component';
import { ProfessorManagementComponent } from './pages/professor-management/professor-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfessorRoutingModule } from './professor-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ProfessorFormModalComponent } from './components/professor-form-modal/professor-form-modal.component';
import { ProfessorPreferredDaysFromComponent } from './components/professor-preferred-days-from/professor-preferred-days-from.component';
import { ProfessorPreferredDaysFromModalComponent } from './components/professor-preferred-days-from-modal/professor-preferred-days-from-modal.component';
import { ProfessorSelfViewComponent } from './pages/professor-self-view/professor-self-view.component';

@NgModule({
  declarations: [
    ProfessorDetailsComponent,
    ProfessorManagementComponent,
    ProfessorFormModalComponent,
    ProfessorPreferredDaysFromComponent,
    ProfessorPreferredDaysFromModalComponent,
    ProfessorSelfViewComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, ProfessorRoutingModule, SharedModule],
  exports: [ProfessorManagementComponent],
})
export class ProfessorModule {}
