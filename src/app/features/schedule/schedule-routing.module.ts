import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleManagementComponent } from './pages/schedule-management/schedule-management.component';

const routes: Routes = [
  { path: 'schedules', component: ScheduleManagementComponent },
  { path: 'departments/:id/schedules', component: ScheduleManagementComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {}
