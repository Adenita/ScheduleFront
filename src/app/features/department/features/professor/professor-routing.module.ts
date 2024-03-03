import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessorManagementComponent } from './pages/professor-management/professor-management.component';
import { ProfessorDetailsComponent } from './pages/professor-details/professor-details.component';

const routes: Routes = [
  {
    path: '',
    component: ProfessorManagementComponent,
    children: [
      {
        path: ':ppid',
        component: ProfessorDetailsComponent,
        children: [
          {
            path: 'subjects',
            loadChildren: () => import('../subject/subject.module').then((m) => m.SubjectModule),
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
export class ProfessorRoutingModule {}
