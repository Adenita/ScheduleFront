import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClassroomManagementComponent } from './components/classroom-management/classroom-management.component';
import { RouterModule, Routes } from '@angular/router';
import { ProfessorManagementComponent } from './components/professor-management/professor-management.component';
import { SubjectManagementComponent } from './components/subject-management/subject-management.component';
import { StudentGroupManagementComponent } from './components/student-group-management/student-group-management.component';
import { ScheduleManagementComponent } from './components/schedule-management/schedule-management.component';
import { ProfessorListComponent } from './components/professor-list/professor-list.component';
import { ClassroomListComponent } from './components/classroom-list/classroom-list.component';
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { StudentGroupListComponent } from './components/student-group-list/student-group-list.component';
import { SubjectDetailsComponent } from './components/subject-details/subject-details.component';
import { ProfessorDetailsComponent } from './components/professor-details/professor-details.component';
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
    path: 'departments/:id/professors',
    component: ProfessorManagementComponent,
  },
  {
    path: 'departments/:id/professors/:ppid',
    component: ProfessorDetailsComponent,
  },
  {
    path: 'departments/:id/programs/:pid/subjects',
    component: SubjectManagementComponent,
  },
  {
    path: 'departments/:id/programs/:pid/subjects/:sid',
    component: SubjectDetailsComponent,
  },
  {
    path: 'departments/:id/programs/:pid/subjects/:sid/professors',
    component: ProfessorManagementComponent,
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
    ProfessorManagementComponent,
    SubjectManagementComponent,
    StudentGroupManagementComponent,
    ScheduleManagementComponent,
    ProfessorListComponent,
    ClassroomListComponent,
    SubjectListComponent,
    StudentGroupListComponent,
    SubjectDetailsComponent,
    ProfessorDetailsComponent,
    Schedule,
    ScheduleGenerationModalComponent,
    HomeComponent,
    ScheduleProgramComponent,
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule, ProfessorListComponent, SubjectListComponent, ClassroomListComponent],
})
export class AppModule {}
