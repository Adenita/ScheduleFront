import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleManagementComponent } from './pages/schedule-management/schedule-management.component';
import { ClassroomScheduleManagementComponent } from './pages/classroom-schedule-management/classroom-schedule-management.component';
import { ProgramScheduleManagementComponent } from './pages/program-schedule-management/program-schedule-management.component';
import { ProfessorScheduleManagementComponent } from './pages/professor-schedule-management/professor-schedule-management.component';

const routes: Routes = [
  { path: 'schedules', component: ScheduleManagementComponent },
  { path: 'departments/:id/schedules', component: ScheduleManagementComponent },
  { path: 'schedules/:scid/classrooms/:cid', component: ClassroomScheduleManagementComponent },
  { path: 'departments/:id/schedules/:scid/classrooms/:cid', component: ClassroomScheduleManagementComponent },
  { path: 'schedules/:scid/programs/:pid', component: ProgramScheduleManagementComponent },
  { path: 'departments/:id/schedules/:scid/programs/:pid', component: ProgramScheduleManagementComponent },
  { path: 'schedules/:scid/professors/:ppid', component: ProfessorScheduleManagementComponent },
  { path: 'departments/:id/schedules/:scid/professors/:ppid', component: ProfessorScheduleManagementComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {}
