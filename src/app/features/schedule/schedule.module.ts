import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ScheduleGenerationModalComponent } from './components/schedule-generation-modal/schedule-generation-modal.component';
import { ProgramScheduleComponent } from './components/program-schedule/program-schedule.component';
import { ScheduleManagementComponent } from './pages/schedule-management/schedule-management.component';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { ClassroomScheduleComponent } from './components/classroom-schedule/classroom-schedule.component';
import { ClassroomScheduleManagementComponent } from './pages/classroom-schedule-management/classroom-schedule-management.component';
import { ProgramScheduleManagementComponent } from './pages/program-schedule-management/program-schedule-management.component';
import { ProfessorScheduleManagementComponent } from './pages/professor-schedule-management/professor-schedule-management.component';
import { ProfessorScheduleComponent } from './components/professor-schedule/professor-schedule.component';
import { ScheduleGeneratorComponent } from './components/schedule-generator/schedule-generator.component';
import { ScheduleCalendarComponent } from './components/schedule-calendar/schedule-calendar.component';
import { ScheduleGeneratorManagementComponent } from './pages/schedule-generator-management/schedule-generator-management.component';

@NgModule({
    declarations: [
        ScheduleComponent,
        ScheduleGenerationModalComponent,
        ProgramScheduleComponent,
        ScheduleManagementComponent,
        ClassroomScheduleComponent,
        ClassroomScheduleManagementComponent,
        ProgramScheduleManagementComponent,
        ProfessorScheduleManagementComponent,
        ProfessorScheduleComponent,
        ScheduleGeneratorComponent,
        ScheduleCalendarComponent,
        ScheduleGeneratorManagementComponent,
    ],
    imports: [CommonModule, ScheduleRoutingModule],
    exports: [ScheduleManagementComponent],
})
export class ScheduleModule {}
