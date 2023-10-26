import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramListComponent } from './components/program-list/program-list.component';
import { ProgramDetailsComponent } from './pages/program-details/program-details.component';
import { ProgramManagementComponent } from './pages/program-management/program-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgramRoutingModule } from './program-routing.module';
import { StudentGroupModule } from '../student-group/student-group.module';
import { SharedModule } from '../../shared/shared.module';
import { ProgramFormModalComponent } from './components/program-form-modal/program-form-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ProgramListComponent, ProgramDetailsComponent, ProgramManagementComponent, ProgramFormModalComponent],
  imports: [CommonModule, ReactiveFormsModule, ProgramRoutingModule, StudentGroupModule, SharedModule],
  exports: [ProgramListComponent],
  providers: [NgbActiveModal],
})
export class ProgramModule {}
