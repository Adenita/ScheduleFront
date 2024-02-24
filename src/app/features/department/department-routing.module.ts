import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentDetailsComponent } from './pages/department-details/department-details.component';
import { DepartmentsListComponent } from './components/departments-list/departments-list.component';
import { UserDetailsComponent } from './features/user/pages/user-details/user-details.component';

const routes: Routes = [
  { path: '', component: DepartmentsListComponent },
  {
    path: ':id',
    component: DepartmentDetailsComponent,
    children: [
      {
        path: 'programs',
        loadChildren: () => import('./features/program/program.module').then((m) => m.ProgramModule),
      },
      {
        path: 'professors',
        loadChildren: () => import('./features/professor/professor.module').then((m) => m.ProfessorModule),
      },
      {
        path: 'subjects',
        loadChildren: () => import('./features/subject/subject.module').then((m) => m.SubjectModule),
      },
      {
        path: 'classrooms',
        loadChildren: () => import('./features/classroom/classroom.module').then((m) => m.ClassroomModule),
      },
      {
        path: 'users',
        loadChildren: () => import('./features/user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'student-groups',
        loadChildren: () => import('./features/student-group/student-group.module').then((m) => m.StudentGroupModule),
      },
    ],
  },

  {
    path: 'profile',
    component: UserDetailsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentRoutingModule {}
