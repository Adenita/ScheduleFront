import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfessorManagementComponent } from './pages/professor-management/professor-management.component';
import { ProfessorDetailsComponent } from './pages/professor-details/professor-details.component';
import { ProfessorPreferredDaysFromComponent } from './components/professor-preferred-days-from/professor-preferred-days-from.component';
import { ProfessorSelfViewComponent } from './pages/professor-self-view/professor-self-view.component';

const routes: Routes = [
  {
    path: 'self/:ppid',
    component: ProfessorSelfViewComponent,
    children: [
      {
        path: '',
        redirectTo: 'preferred',
        pathMatch: 'full',
      },
      {
        path: 'preferred',
        component: ProfessorPreferredDaysFromComponent,
      },
      {
        path: 'subjects',
        loadChildren: () => import('../subject/subject.module').then((m) => m.SubjectModule),
      },
    ],
  },
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
          {
            path: 'preferred',
            component: ProfessorPreferredDaysFromComponent,
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
