import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ScheduleGenerationModalComponent } from './components/schedule-generation-modal/schedule-generation-modal.component';
import { ProgramScheduleComponent } from './components/program-schedule/program-schedule.component';
import { ScheduleManagementComponent } from './pages/schedule-management/schedule-management.component';

@NgModule({
  declarations: [ScheduleComponent, ScheduleGenerationModalComponent, ProgramScheduleComponent, ScheduleManagementComponent],
  imports: [CommonModule],
})
export class ScheduleModule {}
