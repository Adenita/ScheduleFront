import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClassroomManagementComponent } from './components/classroom-management/classroom-management.component';
import { RouterModule, Routes } from '@angular/router';
import { StudentGroupManagementComponent } from './department/sub-modules/student-group/pages/student-group-management/student-group-management.component';
import { ScheduleManagementComponent } from './components/schedule-management/schedule-management.component';
import { ClassroomListComponent } from './components/classroom-list/classroom-list.component';
import { StudentGroupListComponent } from './department/sub-modules/student-group/components/student-group-list/student-group-list.component';
import { Schedule } from './components/schedule/schedule.component';
import { ScheduleGenerationModalComponent } from './components/schedule-generation-modal/schedule-generation-modal.component';
import { HomeComponent } from './pages/home/home.component';
import { ScheduleProgramComponent } from './components/schedule-program/schedule-program.component';

const routes: Routes = [
  {
    path: 'departments/:id/classrooms',
    component: ClassroomManagementComponent,
  },
  {
    path: 'departments/:id/programs/:pid/student_groups',
    component: StudentGroupManagementComponent,
  },
  { path: 'schedules', component: Schedule },
];

@NgModule({
  declarations: [
    AppComponent,
    ClassroomManagementComponent,
    StudentGroupManagementComponent,
    ScheduleManagementComponent,
    ClassroomListComponent,
    StudentGroupListComponent,
    Schedule,
    ScheduleGenerationModalComponent,
    HomeComponent,
    ScheduleProgramComponent,
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule, ClassroomListComponent],
})
export class AppModule {}
