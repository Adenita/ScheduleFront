import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramManagementComponent } from './pages/program-management/program-management.component';
import { ProgramDetailsComponent } from './pages/program-details/program-details.component';

const routes: Routes = [
  {
    path: '',
    component: ProgramManagementComponent,
    children: [
      {
        path: ':pid',
        component: ProgramDetailsComponent,
        children: [
          {
            path: 'professors',
            loadChildren: () => import('../professor/professor.module').then((m) => m.ProfessorModule),
          },
          {
            path: 'subjects',
            loadChildren: () => import('../subject/subject.module').then((m) => m.SubjectModule),
          },
          {
            path: 'student-groups',
            loadChildren: () => import('../student-group/student-group.module').then((m) => m.StudentGroupModule),
          },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramRoutingModule {}
