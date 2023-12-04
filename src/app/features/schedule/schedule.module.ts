import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ScheduleGenerationModalComponent } from './components/schedule-generation-modal/schedule-generation-modal.component';
import { ProgramScheduleComponent } from './components/program-schedule/program-schedule.component';
import { ScheduleManagementComponent } from './pages/schedule-management/schedule-management.component';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { ClassroomScheduleComponent } from './components/classroom-schedule/classroom-schedule.component';
import { ClassroomScheduleManagementComponent } from './pages/classroom-schedule-management/classroom-schedule-management.component';

@NgModule({
  declarations: [ScheduleComponent, ScheduleGenerationModalComponent, ProgramScheduleComponent, ScheduleManagementComponent, ClassroomScheduleComponent, ClassroomScheduleManagementComponent],
  imports: [CommonModule, ScheduleRoutingModule],
})
export class ScheduleModule {}
