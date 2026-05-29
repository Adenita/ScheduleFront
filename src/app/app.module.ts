import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthModule } from './auth/auth.module';
import { CustomRouterLinkActiveDirective } from './directives/custom-router-link-active.directive';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { Role } from './shared/models/user';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ManageDataComponent } from './pages/manage-data/manage-data.component';
import { SchedulesHubComponent } from './pages/schedules-hub/schedules-hub.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'aboutus',
    component: AboutusComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN, Role.PROFESSOR, Role.STUDENT] },
  },
  {
    path: 'manage-data',
    component: ManageDataComponent,
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN, Role.PROFESSOR, Role.STUDENT] },
  },
  {
    path: 'programs',
    loadChildren: () => import('./features/department/features/program/program.module').then((m) => m.ProgramModule),
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN] },
  },
  {
    path: 'professors',
    loadChildren: () => import('./features/department/features/professor/professor.module').then((m) => m.ProfessorModule),
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN] },
  },
  {
    path: 'subjects',
    loadChildren: () => import('./features/department/features/subject/subject.module').then((m) => m.SubjectModule),
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN] },
  },
  {
    path: 'classrooms',
    loadChildren: () => import('./features/department/features/classroom/classroom.module').then((m) => m.ClassroomModule),
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN] },
  },
  {
    path: 'student-groups',
    loadChildren: () => import('./features/department/features/student-group/student-group.module').then((m) => m.StudentGroupModule),
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN] },
  },
  {
    path: 'schedule-center',
    component: SchedulesHubComponent,
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN, Role.PROFESSOR, Role.STUDENT] },
  },
  {
    path: 'departments',
    loadChildren: () => import('./features/department/department.module').then((m) => m.DepartmentModule),
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN, Role.PROFESSOR, Role.STUDENT] },
  },
  {
    path: 'schedules',
    loadChildren: () => import('./features/schedule/schedule.module').then((m) => m.ScheduleModule),
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN, Role.PROFESSOR, Role.STUDENT] },
  },
  {
    path: 'me',
    loadChildren: () => import('./features/department/features/professor/professor.module').then((m) => m.ProfessorModule),
    canActivate: [AuthGuard],
    data: { role: [Role.PROFESSOR] },
  },
  {
    path: 'users',
    loadChildren: () => import('./features/department/features/user/user.module').then((m) => m.UserModule),
    canActivate: [AuthGuard],
    data: { role: [Role.ADMIN] },
  },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutusComponent,
    DashboardComponent,
    HeaderBarComponent,
    SidebarComponent,
    ManageDataComponent,
    SchedulesHubComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    AuthModule,
    CustomRouterLinkActiveDirective,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule],
})
export class AppModule {}
