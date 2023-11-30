import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleListComponent } from './components/schedule-list/schedule-list.component';

const routes: Routes = [
  { path: 'departments/:id/schedules', component: ScheduleListComponent },
  { path: 'schedules', component: ScheduleListComponent },
];

@NgModule({
  declarations: [ScheduleListComponent],
  imports: [CommonModule, FormsModule, RouterModule.forRoot(routes)],
  exports: [RouterModule, ScheduleListComponent],
})
export class FeatureSharedModule {}
