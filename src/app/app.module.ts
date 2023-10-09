import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClassroomManagementComponent } from './components/classroom-management/classroom-management.component';
import { RouterModule, Routes } from '@angular/router';
import { ProfessorManagementComponent } from './components/professor-management/professor-management.component';
import { SubjectManagementComponent } from './components/subject-management/subject-management.component';
import { DepartmentsListComponent } from './components/departments-list/departments-list.component';
import { ProgramManagementComponent } from './components/program-management/program-management.component';
import { StudentGroupManagementComponent } from './components/student-group-management/student-group-management.component';
import { DepartmentDetailsComponent } from './components/department-details/department-details.component';
import { ProgramDetailsComponent } from './components/program-details/program-details.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ProgramScheduleComponent } from './components/program-schedule/program-schedule.component';
import { ProgramListComponent } from './components/program-list/program-list.component';
import { ProfessorListComponent } from './components/professor-list/professor-list.component';
import { ClassroomListComponent } from './components/classroom-list/classroom-list.component';
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { StudentGroupListComponent } from './components/student-group-list/student-group-list.component';
import { SubjectDetailsComponent } from './components/subject-details/subject-details.component';
import { ProfessorDetailsComponent } from './components/professor-details/professor-details.component';

const routes: Routes = [
  { path: 'departments', component: DepartmentsListComponent },
  { path: 'departments/:id', component: DepartmentDetailsComponent },
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
  { path: 'departments/:id/programs', component: ProgramManagementComponent },
  { path: 'departments/:id/programs/:pid', component: ProgramDetailsComponent },
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
  { path: 'schedules', component: ScheduleComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ClassroomManagementComponent,
    ProfessorManagementComponent,
    SubjectManagementComponent,
    DepartmentsListComponent,
    ProgramManagementComponent,
    StudentGroupManagementComponent,
    DepartmentDetailsComponent,
    ProgramDetailsComponent,
    ScheduleComponent,
    ProgramScheduleComponent,
    ProgramListComponent,
    ProfessorListComponent,
    ClassroomListComponent,
    SubjectListComponent,
    StudentGroupListComponent,
    SubjectDetailsComponent,
    ProfessorDetailsComponent,
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule {}
