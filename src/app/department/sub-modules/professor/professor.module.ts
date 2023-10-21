import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessorListComponent } from './components/professor-list/professor-list.component';
import { ProfessorDetailsComponent } from './pages/professor-details/professor-details.component';
import { ProfessorManagementComponent } from './pages/professor-management/professor-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfessorRoutingModule } from './professor-routing.module';

@NgModule({
  declarations: [ProfessorListComponent, ProfessorDetailsComponent, ProfessorManagementComponent],
  imports: [CommonModule, ReactiveFormsModule, ProfessorRoutingModule],
  exports: [ProfessorListComponent],
})
export class ProfessorModule {}
