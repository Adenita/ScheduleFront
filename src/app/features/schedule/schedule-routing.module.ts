import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleManagementComponent } from './pages/schedule-management/schedule-management.component';
import { ClassroomScheduleManagementComponent } from './pages/classroom-schedule-management/classroom-schedule-management.component';

const routes: Routes = [
  { path: 'schedules', component: ScheduleManagementComponent },
  { path: 'departments/:id/schedules', component: ScheduleManagementComponent },
  { path: 'schedules/:scid/classrooms/:cid', component: ClassroomScheduleManagementComponent },
  { path: 'departments/:id/schedules/:scid/classrooms/:cid', component: ClassroomScheduleManagementComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {}
