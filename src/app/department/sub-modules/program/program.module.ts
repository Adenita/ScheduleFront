import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramListComponent } from './components/program-list/program-list.component';
import { ProgramDetailsComponent } from './pages/program-details/program-details.component';
import { ProgramManagementComponent } from './pages/program-management/program-management.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProgramListComponent, ProgramDetailsComponent, ProgramManagementComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProgramModule {}
