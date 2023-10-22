import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClassroomManagementComponent } from './department/sub-modules/classroom/pages/classroom-management/classroom-management.component';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleManagementComponent } from './components/schedule-management/schedule-management.component';
import { ClassroomListComponent } from './department/sub-modules/classroom/components/classroom-list/classroom-list.component';
import { Schedule } from './components/schedule/schedule.component';
import { ScheduleGenerationModalComponent } from './components/schedule-generation-modal/schedule-generation-modal.component';
import { HomeComponent } from './pages/home/home.component';
import { ScheduleProgramComponent } from './components/schedule-program/schedule-program.component';

const routes: Routes = [
  {
    path: 'departments/:id/classrooms',
    component: ClassroomManagementComponent,
  },
  { path: 'schedules', component: Schedule },
];

@NgModule({
  declarations: [AppComponent, ScheduleManagementComponent, Schedule, ScheduleGenerationModalComponent, HomeComponent, ScheduleProgramComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule {}
